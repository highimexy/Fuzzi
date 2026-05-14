package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
	"github.com/joho/godotenv"
)

type MessagesFile struct {
	Lessons struct {
		QALessons struct {
			Items map[string]LessonItem `json:"items"`
		} `json:"qaLessons"`
		RealityLessons struct {
			Items map[string]LessonItem `json:"items"`
		} `json:"realityLessons"`
	} `json:"Lessons"`
}

type LessonItem struct {
	Title      string `json:"title"`
	Status     string `json:"status"`
	Difficulty string `json:"difficulty"`
}

func main() {
	log.Println("[SEEDER] Inicjalizacja...")
	godotenv.Load()
	database.Connect()

	database.DB.AutoMigrate(&models.Lesson{})

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

	for i := 1; i <= 100; i++ {
		key := strconv.Itoa(i)
		enItem, okEN := enData.Lessons.QALessons.Items[key]
		plItem, okPL := plData.Lessons.QALessons.Items[key]

		if okEN && okPL {
			lessonsToInsert = append(lessonsToInsert, models.Lesson{
				Track:      "qa",
				Difficulty: enItem.Difficulty,
				Status:     enItem.Status,
				TitleEN:    enItem.Title,
				TitlePL:    plItem.Title,
				ContentEN:  fmt.Sprintf("# %s\n\nLesson content is being written...", enItem.Title),
				ContentPL:  fmt.Sprintf("# %s\n\nTreść lekcji jest w przygotowaniu...", plItem.Title),
			})
		}
	}

	for i := 1; i <= 100; i++ {
		key := strconv.Itoa(i)
		enItem, okEN := enData.Lessons.RealityLessons.Items[key]
		plItem, okPL := plData.Lessons.RealityLessons.Items[key]

		if okEN && okPL {
			lessonsToInsert = append(lessonsToInsert, models.Lesson{
				Track:      "reality",
				Difficulty: enItem.Difficulty,
				Status:     enItem.Status,
				TitleEN:    enItem.Title,
				TitlePL:    plItem.Title,
				ContentEN:  fmt.Sprintf("# %s\n\nLesson content is being written...", enItem.Title),
				ContentPL:  fmt.Sprintf("# %s\n\nTreść lekcji jest w przygotowaniu...", plItem.Title),
			})
		}
	}

	result := database.DB.Create(&lessonsToInsert)
	if result.Error != nil {
		log.Fatalf("[FATAL] Błąd zapisu do bazy: %v", result.Error)
	}

	log.Printf("[SUCCESS] Zasiano %d dwujęzycznych lekcji w bazie danych!", result.RowsAffected)
}
