package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/highimexy/it-shit/backend/internal/auth"
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

	database.Connect()

	finnhubKey := os.Getenv("FINNHUB_API_KEY")

	tweetCache := twitter.NewCache()
	go twitter.StartWorker(tweetCache)

	marketHub := market.NewHub()
	marketEngine := market.NewEngine(marketHub)
	go marketEngine.Start(finnhubKey)

	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	r.GET("/api/v1/tweets", gin.WrapF(twitter.NewHandler(tweetCache)))
	r.GET("/ws/market", gin.WrapF(market.NewHandler(marketHub, marketEngine)))

	// PUBLIC
	v1 := r.Group("/api/v1")
	{
		v1.GET("/lessons", lessons.ListHandler)
		v1.GET("/lessons/:id", lessons.GetHandler)

		v1.POST("/auth/otp/start", auth.StartOTPHandler)
		v1.POST("/auth/otp/verify", auth.VerifyOTPHandler)
	}

	// 4. PROTECTED
	protected := r.Group("/api/v1")
	protected.Use(auth.EnsureValidToken())
	{
		protected.GET("/sync-user", auth.SyncUserHandler)
	}

	port := ":8080"
	log.Printf("[SYSTEM] API listening on port %s", port)

	if err := r.Run(port); err != nil {
		log.Fatalf("[FATAL] Server crashed: %v", err)
	}
}
