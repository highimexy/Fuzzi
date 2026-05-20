package main

import (
	"encoding/json"
	"log"
	"os"
	"path/filepath"
	"strconv"

	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
	"github.com/joho/godotenv"
	gonanoid "github.com/matoous/go-nanoid/v2"
	"gorm.io/datatypes"
)

// Struktury JSON
type MessagesFile struct {
	Lessons struct {
		QALessons      struct { Items map[string]LessonItem `json:"items"` } `json:"qaLessons"`
		RealityLessons struct { Items map[string]LessonItem `json:"items"` } `json:"realityLessons"`
	} `json:"Lessons"`
}

type LessonItem struct {
	Title      string `json:"title"`
	Status     string `json:"status"`
	Difficulty string `json:"difficulty"`
}

// Funkcje pomocnicze
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

func main() {
	log.Println("[SEEDER] Inicjalizacja...")
	godotenv.Load()
	database.Connect()

	// Reset bazy
	database.DB.Exec("DROP TABLE IF EXISTS lessons CASCADE")
	database.DB.AutoMigrate(&models.Lesson{})

	// Wczytaj bazowe JSONy
	enFile, err := os.ReadFile("data/lessons/en.json")
	if err != nil {
		log.Fatalf("[FATAL] Brak pliku en.json: %v", err)
	}
	plFile, err := os.ReadFile("data/lessons/pl.json")
	if err != nil {
		log.Fatalf("[FATAL] Brak pliku pl.json: %v", err)
	}

	var enData, plData MessagesFile
	json.Unmarshal(enFile, &enData)
	json.Unmarshal(plFile, &plData)

	var lessonsToInsert []models.Lesson

	// Funkcja seedująca dla QA i Reality
	seedTrack := func(track string, items map[string]LessonItem, isQA bool) {
		for i := 1; i <= 100; i++ {
			key := strconv.Itoa(i)
			enItem, ok := items[key]
			if !ok {
				continue
			}

			contentEN := readContent(filepath.Join("data", "lessons", "markdown", "en", track, key+".md"))
			contentPL := readContent(filepath.Join("data", "lessons", "markdown", "pl", track, key+".md"))

			payloadEN := readPayload(filepath.Join("data", "lessons", "tasks", "en", track, key+".json"))
			payloadPL := readPayload(filepath.Join("data", "lessons", "tasks", "pl", track, key+".json"))

			// Typ lekcji
			lessonType := "article"
			if string(payloadEN) != "{}" {
				lessonType = "quiz"
			}

			// Mapowanie tytułu PL
			var titlePL string
			if isQA {
				titlePL = plData.Lessons.QALessons.Items[key].Title
			} else {
				titlePL = plData.Lessons.RealityLessons.Items[key].Title
			}

			// Generowanie unikalnego ID (NanoID)
			id, _ := gonanoid.New()

			lessonsToInsert = append(lessonsToInsert, models.Lesson{
				ID:         id,
				Track:      track,
				Difficulty: enItem.Difficulty,
				Status:     enItem.Status,
				LessonType: lessonType,
				TitleEN:    enItem.Title,
				TitlePL:    titlePL,
				ContentEN:  contentEN,
				ContentPL:  contentPL,
				PayloadEN:  payloadEN,
				PayloadPL:  payloadPL,
			})
		}
	}

	// Odpal seedowanie dla obu ścieżek
	seedTrack("qa", enData.Lessons.QALessons.Items, true)
	seedTrack("reality", enData.Lessons.RealityLessons.Items, false)

	if err := database.DB.Create(&lessonsToInsert).Error; err != nil {
		log.Fatalf("[FATAL] Błąd zapisu do bazy: %v", err)
	}

	log.Printf("[SUCCESS] Zasiano %d lekcji!", len(lessonsToInsert))
}
