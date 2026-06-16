package main

import (
	"log"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/highimexy/it-shit/backend/internal/admin"
	"github.com/highimexy/it-shit/backend/internal/auth"
	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/discuss"
	"github.com/highimexy/it-shit/backend/internal/lessons"
	"github.com/highimexy/it-shit/backend/internal/market"
	"github.com/highimexy/it-shit/backend/internal/quest"
	"github.com/highimexy/it-shit/backend/internal/ranking"
	"github.com/highimexy/it-shit/backend/internal/twitter"
	"github.com/highimexy/it-shit/backend/internal/users"
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

	// Behind a reverse proxy (nginx/Cloudflare), trust only the configured
	// proxies so c.ClientIP() reflects the real visitor — the OTP rate limiter
	// keys on it. TRUSTED_PROXIES is a comma-separated list of CIDRs/IPs;
	// when unset, no proxy is trusted and ClientIP falls back to RemoteAddr.
	if tp := os.Getenv("TRUSTED_PROXIES"); tp != "" {
		proxies := strings.Split(tp, ",")
		for i := range proxies {
			proxies[i] = strings.TrimSpace(proxies[i])
		}
		if err := r.SetTrustedProxies(proxies); err != nil {
			log.Fatalf("[FATAL] Invalid TRUSTED_PROXIES: %v", err)
		}
	} else {
		r.SetTrustedProxies(nil)
	}

	allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:3000"
	}
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{allowedOrigin}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	r.Static("/uploads", "./uploads")
	r.GET("/api/v1/tweets", gin.WrapF(twitter.NewHandler(tweetCache)))
	r.GET("/ws/market", gin.WrapF(market.NewHandler(marketHub, marketEngine)))

	// PUBLIC
	v1 := r.Group("/api/v1")
	{
		v1.GET("/tracks/:track/groups", lessons.TrackHandler)
		v1.GET("/groups/:groupId", lessons.GroupHandler)
		v1.GET("/lessons", lessons.ListHandler)
		v1.GET("/lessons/:id", lessons.GetHandler)

		v1.POST("/auth/otp/start", auth.StartOTPHandler)
		v1.POST("/auth/otp/verify", auth.VerifyOTPHandler)
		v1.POST("/auth/google/callback", auth.GoogleCallbackHandler)
		v1.POST("/auth/refresh", auth.RefreshHandler)
		v1.POST("/auth/logout", auth.LogoutHandler)

		v1.GET("/quest/daily", quest.GetDailyQuestHandler)
		v1.GET("/quests", quest.ListQuestsHandler)

		v1.GET("/users/:id", users.GetPublicProfileHandler)
		v1.GET("/users/:id/posts", users.GetPublicProfilePostsHandler)
		v1.GET("/ranking", ranking.GetRankingHandler)
	}

	// PROTECTED
	protected := r.Group("/api/v1")
	protected.Use(auth.EnsureValidToken())
	{
		protected.GET("/sync-user", auth.SyncUserHandler)
		protected.POST("/lessons/:id/submit", lessons.SubmitHandler)
		protected.GET("/lessons/:id/progress", lessons.ProgressHandler)

		protected.GET("/groups/:groupId/progress", lessons.GroupProgressHandler)

		protected.GET("/quest/stats", quest.GetUserStatsHandler)
		protected.GET("/quest/:id/result", quest.GetQuestResultHandler)

		protected.POST("/discuss/posts", discuss.CreateHandler)
		protected.PUT("/discuss/posts/:id", discuss.UpdateHandler)
		protected.DELETE("/discuss/posts/:id", discuss.DeleteHandler)
		protected.POST("/discuss/posts/:id/vote", discuss.VoteHandler)
		protected.POST("/discuss/posts/:id/comments", discuss.CreateCommentHandler)
		protected.DELETE("/discuss/comments/:commentId", discuss.DeleteCommentHandler)
		protected.GET("/discuss/my-posts", discuss.ListMyPostsHandler)

		protected.GET("/me/profile", users.GetMyProfileHandler)
		protected.PUT("/me/profile", users.UpdateMyProfileHandler)
		protected.POST("/me/avatar", users.UploadAvatarHandler)
		protected.DELETE("/me", users.DeleteMyAccountHandler)
	}

	// ADMIN
	adminGroup := r.Group("/api/v1/admin")
	adminGroup.Use(auth.EnsureValidToken(), auth.EnsureAdmin())
	{
		adminGroup.GET("/stats", admin.StatsHandler)
		adminGroup.GET("/charts", admin.ChartsHandler)

		adminGroup.GET("/users", admin.ListUsersHandler)
		adminGroup.PATCH("/users/:id/role", admin.UpdateUserRoleHandler)
		adminGroup.DELETE("/users/:id", admin.DeleteUserHandler)

		adminGroup.GET("/discuss/posts", admin.ListDiscussPostsHandler)
		adminGroup.DELETE("/discuss/posts/:id", admin.DeleteDiscussPostHandler)

		adminGroup.GET("/quests", admin.ListQuestsHandler)
		adminGroup.POST("/quests", admin.CreateQuestHandler)
		adminGroup.PUT("/quests/:id", admin.UpdateQuestHandler)
	}

	// SEMI-PROTECTED — optional auth (guests see data, logged-in users get has_voted etc.)
	semi := r.Group("/api/v1")
	semi.Use(auth.OptionalToken())
	{
		semi.POST("/quest/:id/submit", quest.SubmitQuestHandler)
		semi.GET("/groups/:groupId/completed-lessons", lessons.GroupCompletedLessonsHandler)

		semi.GET("/discuss/posts", discuss.ListHandler)
		semi.GET("/discuss/posts/:id", discuss.GetHandler)
		semi.GET("/discuss/posts/:id/comments", discuss.ListCommentsHandler)
	}

	port := ":8080"
	log.Printf("[SYSTEM] API listening on port %s", port)

	if err := r.Run(port); err != nil {
		log.Fatalf("[FATAL] Server crashed: %v", err)
	}
}
