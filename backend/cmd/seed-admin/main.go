package main

import (
	"fmt"
	"log"
	"os"

	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
	"github.com/joho/godotenv"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "Usage: seed-admin <email>")
		os.Exit(1)
	}
	email := os.Args[1]

	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system env")
	}

	database.Connect()

	result := database.DB.Model(&models.User{}).
		Where("email = ?", email).
		Update("role", "admin")

	if result.Error != nil {
		log.Fatalf("Failed to update role: %v", result.Error)
	}
	if result.RowsAffected == 0 {
		log.Fatalf("No user found with email: %s", email)
	}
	fmt.Printf("OK: %s is now admin\n", email)
}
