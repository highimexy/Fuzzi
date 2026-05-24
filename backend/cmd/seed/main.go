package main

import (
	"encoding/json"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
	"github.com/joho/godotenv"
	"gorm.io/datatypes"
)

// ─────────────────────────────────────────────
// Struktury JSON dla plików grup
// backend/data/lessons/groups/en/qa.json
// ─────────────────────────────────────────────

type GroupItem struct {
	Order      int    `json:"order"`
	TitleEN    string `json:"title_en"`
	TitlePL    string `json:"title_pl"`
	DescEN     string `json:"desc_en"`
	DescPL     string `json:"desc_pl"`
	Difficulty string `json:"difficulty"`
	AccessTier string `json:"access_tier"`
}

// Struktura sub-lekcji w plikach en.json / pl.json (bez zmian)
type LessonItem struct {
	Title      string `json:"title"`
	Status     string `json:"status"`
	Difficulty string `json:"difficulty"`
}

type MessagesFile struct {
	Lessons struct {
		QALessons      struct{ Items map[string]LessonItem `json:"items"` } `json:"qaLessons"`
		RealityLessons struct{ Items map[string]LessonItem `json:"items"` } `json:"realityLessons"`
	} `json:"Lessons"`
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

func readContent(path string) string {
	content, err := os.ReadFile(path)
	if err != nil {
		return "## Content Pending\nThis content is being written..."
	}
	return string(content)
}

func readPayload(path string) datatypes.JSON {
	content, err := os.ReadFile(path)
	if err != nil {
		return datatypes.JSON([]byte("{}"))
	}
	return datatypes.JSON(content)
}

func extractTitle(content, fallback string) string {
	for _, line := range strings.SplitN(content, "\n", 20) {
		trimmed := strings.TrimSpace(line)
		if strings.HasPrefix(trimmed, "# ") {
			return strings.TrimPrefix(trimmed, "# ")
		}
	}
	return fallback
}

func detectLessonType(payload datatypes.JSON) string {
	if len(payload) == 0 {
		return "article"
	}
	var meta struct {
		Type string `json:"type"`
	}
	if err := json.Unmarshal(payload, &meta); err == nil && meta.Type != "" {
		return meta.Type
	}
	return "article"
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

func main() {
	log.Println("[SEEDER] Inicjalizacja...")
	godotenv.Load()
	database.Connect()

	// Reset tabel
	database.DB.Exec("DROP TABLE IF EXISTS lesson_progresses CASCADE")
	database.DB.Exec("DROP TABLE IF EXISTS lessons CASCADE")
	database.DB.Exec("DROP TABLE IF EXISTS lesson_groups CASCADE")
	database.DB.AutoMigrate(&models.LessonGroup{}, &models.Lesson{}, &models.LessonProgress{})

	// Wczytaj pliki i18n (tytuły sub-lekcji)
	enFile, _ := os.ReadFile("data/lessons/en.json")
	plFile, _ := os.ReadFile("data/lessons/pl.json")
	var enData, plData MessagesFile
	json.Unmarshal(enFile, &enData)
	json.Unmarshal(plFile, &plData)

	seedTrack("qa", enData.Lessons.QALessons.Items, plData.Lessons.QALessons.Items)
	seedTrack("reality", enData.Lessons.RealityLessons.Items, plData.Lessons.RealityLessons.Items)

	log.Println("[SUCCESS] Seeding zakończony!")
}

func seedTrack(track string, enItems, plItems map[string]LessonItem) {
	// Wczytaj grupy dla tracka
	groupsFile, err := os.ReadFile(filepath.Join("data/lessons/groups", track+".json"))
	if err != nil {
		log.Printf("[WARN] Brak pliku grup dla %s, tworzę domyślne grupy", track)
		seedTrackWithDefaultGroups(track, enItems, plItems)
		return
	}

	var groups []GroupItem
	if err := json.Unmarshal(groupsFile, &groups); err != nil {
		log.Fatalf("[FATAL] Błąd parsowania grup %s: %v", track, err)
	}

	for _, g := range groups {
		// Utwórz LessonGroup
		group := models.LessonGroup{
			Track:      track,
			Order:      g.Order,
			TitleEN:    g.TitleEN,
			TitlePL:    g.TitlePL,
			DescEN:     g.DescEN,
			DescPL:     g.DescPL,
			Difficulty: g.Difficulty,
			AccessTier: g.AccessTier,
		}
		if err := database.DB.Create(&group).Error; err != nil {
			log.Printf("[ERROR] Błąd tworzenia grupy %d: %v", g.Order, err)
			continue
		}

		// Seed sub-lekcji dla grupy
		// Szukamy plików w data/lessons/markdown/en/{track}/{order}/
		groupDir := filepath.Join("data/lessons/markdown/en", track, strconv.Itoa(g.Order))
		entries, err := os.ReadDir(groupDir)
		if err != nil {
			// Brak sub-lekcji — seed z en.json jako fallback (stary format)
			seedSubLessonFromFlat(group, g.Order, track, enItems, plItems)
			continue
		}

		// Nowy format: sub-lekcje w folderze
		for subOrder, entry := range entries {
			if entry.IsDir() {
				continue
			}
			subIdx := subOrder + 1
			name := entry.Name()
			baseName := name[:len(name)-3] // usuń .md

			contentEN := readContent(filepath.Join("data/lessons/markdown/en", track, strconv.Itoa(g.Order), name))
			contentPL := readContent(filepath.Join("data/lessons/markdown/pl", track, strconv.Itoa(g.Order), name))
			payloadEN := readPayload(filepath.Join("data/lessons/tasks/en", track, strconv.Itoa(g.Order), baseName+".json"))
			payloadPL := readPayload(filepath.Join("data/lessons/tasks/pl", track, strconv.Itoa(g.Order), baseName+".json"))

			titleEN := extractTitle(contentEN, baseName)
			titlePL := extractTitle(contentPL, titleEN)
			lesson := models.Lesson{
				LessonGroupID: group.ID,
				Order:         subIdx,
				Track:         track,
				Difficulty:    g.Difficulty,
				Status:        "published",
				LessonType:    detectLessonType(payloadEN),
				TitleEN:       titleEN,
				TitlePL:       titlePL,
				ContentEN:     contentEN,
				ContentPL:     contentPL,
				PayloadEN:     payloadEN,
				PayloadPL:     payloadPL,
			}
			database.DB.Create(&lesson)
		}
	}
}

// seedSubLessonFromFlat — fallback dla starego formatu (jeden plik na lekcję)
// Tworzy grupę z jedną sub-lekcją (migracja stopniowa)
func seedSubLessonFromFlat(group models.LessonGroup, order int, track string, enItems, plItems map[string]LessonItem) {
	key := strconv.Itoa(order)
	enItem, ok := enItems[key]
	if !ok {
		return
	}

	contentEN := readContent(filepath.Join("data/lessons/markdown/en", track, key+".md"))
	contentPL := readContent(filepath.Join("data/lessons/markdown/pl", track, key+".md"))
	payloadEN := readPayload(filepath.Join("data/lessons/tasks/en", track, key+".json"))
	payloadPL := readPayload(filepath.Join("data/lessons/tasks/pl", track, key+".json"))

	titlePL := enItem.Title
	if plItem, ok := plItems[key]; ok {
		titlePL = plItem.Title
	}

	lesson := models.Lesson{
		LessonGroupID: group.ID,
		Order:         1,
		Track:         track,
		Difficulty:    enItem.Difficulty,
		Status:        enItem.Status,
		LessonType:    detectLessonType(payloadEN),
		TitleEN:       enItem.Title,
		TitlePL:       titlePL,
		ContentEN:     contentEN,
		ContentPL:     contentPL,
		PayloadEN:     payloadEN,
		PayloadPL:     payloadPL,
	}
	database.DB.Create(&lesson)
}

// seedTrackWithDefaultGroups — tworzy grupy automatycznie z en.json
// używane gdy brak pliku groups/{track}.json
func seedTrackWithDefaultGroups(track string, enItems, plItems map[string]LessonItem) {
	for i := 1; i <= 100; i++ {
		key := strconv.Itoa(i)
		enItem, ok := enItems[key]
		if !ok {
			continue
		}

		// Automatyczne access_tier: 1-3 free, 4-10 registered, reszta premium
		accessTier := "premium"
		if i <= 3 {
			accessTier = "free"
		} else if i <= 10 {
			accessTier = "registered"
		}

		titlePL := enItem.Title
		if plItem, ok := plItems[key]; ok {
			titlePL = plItem.Title
		}

		group := models.LessonGroup{
			Track:      track,
			Order:      i,
			TitleEN:    enItem.Title,
			TitlePL:    titlePL,
			Difficulty: enItem.Difficulty,
			AccessTier: accessTier,
		}
		if err := database.DB.Create(&group).Error; err != nil {
			continue
		}

		seedSubLessonFromFlat(group, i, track, enItems, plItems)
	}
}
