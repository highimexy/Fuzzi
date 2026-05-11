package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/lessons"
	"github.com/highimexy/it-shit/backend/internal/market"
	"github.com/highimexy/it-shit/backend/internal/twitter"
	"github.com/joho/godotenv"
)

func main() {
	log.Println("[SYSTEM] Booting up...")

	if err := godotenv.Load(); err != nil {
		log.Println("[SYSTEM WARNING] No .env file found. Using system environment variables.")
	}

	// 1. BAZA DANYCH (Postgres + GORM)
	database.Connect()

	finnhubKey := os.Getenv("FINNHUB_API_KEY")

	// 2. TWITTER MODULE
	tweetCache := twitter.NewCache()
	go twitter.StartWorker(tweetCache)

	// 3. MARKET MODULE (WebSockets)
	marketHub := market.NewHub()
	marketEngine := market.NewEngine(marketHub)
	go marketEngine.Start(finnhubKey)

	// 4. ROUTING (GIN)
	r := gin.Default()

	// ODBLOKOWANIE CORS DLA FRONTENDU
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:3000"}
    r.Use(cors.New(config))

	// Podpinamy Twoje ISTNIEJĄCE standardowe handlery HTTP za pomocą gin.WrapF
	r.GET("/api/v1/tweets", gin.WrapF(twitter.NewHandler(tweetCache)))
	r.GET("/ws/market", gin.WrapF(market.NewHandler(marketHub, marketEngine)))

	// Nasze NOWE natywne handlery Gina dla Akademii
	v1 := r.Group("/api/v1")
	{
		v1.GET("/lessons", lessons.ListHandler)
		v1.GET("/lessons/:id", lessons.GetHandler) // W Gin parametr to :id
	}

	port := ":8080"
	log.Printf("[SYSTEM] API listening on port %s", port)

	if err := r.Run(port); err != nil {
		log.Fatalf("[FATAL] Server crashed: %v", err)
	}
}
