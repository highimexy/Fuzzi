package database

import (
	"log"
	"os"

	"github.com/highimexy/it-shit/backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("[FATAL] DATABASE_URL is not set in .env file")
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("[FATAL] Failed to connect to database:", err)
	}

	log.Println("[SYSTEM] Database connected successfully")

	err = DB.AutoMigrate(&models.Lesson{}, &models.LessonProgress{}, &models.Quest{}, &models.QuestAttempt{}, &models.UserQuestStats{}, &models.DiscussPost{})
	if err != nil {
		log.Fatal("[FATAL] Failed to migrate database:", err)
	}
}
