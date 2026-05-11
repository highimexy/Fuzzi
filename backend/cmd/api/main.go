package main

import (
	"log"
	"net/http"
	"os"

	"github.com/highimexy/it-shit/backend/internal/market"
	"github.com/highimexy/it-shit/backend/internal/twitter"
	"github.com/joho/godotenv"
)

func main() {
	log.Println("[SYSTEM] Booting up...")

	// Loading .env
	if err := godotenv.Load(); err != nil {
		log.Println("[SYSTEM WARNING] No .env file found. Using system environment variables.")
	}

	finnhubKey := os.Getenv("FINNHUB_API_KEY")

	// TWITTER MODULE
	tweetCache := twitter.NewCache()
	go twitter.StartWorker(tweetCache)

	// MARKET MODULE (WebSockets)
	marketHub := market.NewHub()
	marketEngine := market.NewEngine(marketHub)

	// PRZEKAZUJEMY KLUCZ DO SILNIKA RYNKOWEGO
	go marketEngine.Start(finnhubKey)

	// ROUTING
	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/v1/tweets", twitter.NewHandler(tweetCache))
	mux.HandleFunc("/ws/market", market.NewHandler(marketHub, marketEngine))

	port := ":8080"
	log.Printf("[SYSTEM] API listening on port %s", port)

	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("[FATAL] Server crashed: %v", err)
	}
}
