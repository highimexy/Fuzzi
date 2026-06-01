package quest

import (
	"net/http"
	"time"

	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-gonic/gin"
	gonanoid "github.com/matoous/go-nanoid/v2"
	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
	"gorm.io/datatypes"
)

// questPublic ukrywa correct_key przed frontendem
type questPublic struct {
	ID         string         `json:"id"`
	Type       string         `json:"type"`
	Track      string         `json:"track"`
	Difficulty string         `json:"difficulty"`
	TitleEN    string         `json:"title_en"`
	TitlePL    string         `json:"title_pl"`
	BodyEN     string         `json:"body_en"`
	BodyPL     string         `json:"body_pl"`
	Options    datatypes.JSON `json:"options"`
	XP         int            `json:"xp"`
	ActiveDate string         `json:"active_date"`
	CreatedAt  time.Time      `json:"created_at"`
}

func toPublic(q models.Quest) questPublic {
	return questPublic{
		ID:         q.ID,
		Type:       q.Type,
		Track:      q.Track,
		Difficulty: q.Difficulty,
		TitleEN:    q.TitleEN,
		TitlePL:    q.TitlePL,
		BodyEN:     q.BodyEN,
		BodyPL:     q.BodyPL,
		Options:    q.Options,
		XP:         q.XP,
		ActiveDate: q.ActiveDate,
		CreatedAt:  q.CreatedAt,
	}
}

func getUserID(c *gin.Context) string {
	claims, exists := c.Get("user_claims")
	if !exists {
		return ""
	}
	validated, ok := claims.(*validator.ValidatedClaims)
	if !ok {
		return ""
	}
	return validated.RegisteredClaims.Subject
}

// dailyKey zwraca klucz rotacji oparty na dacie EU (reset o 12:00 Warsaw)
func dailyKey() int {
	loc, err := time.LoadLocation("Europe/Warsaw")
	if err != nil {
		loc = time.FixedZone("CET", 3600)
	}
	now := time.Now().In(loc)
	if now.Hour() < 12 {
		now = now.AddDate(0, 0, -1)
	}
	t, _ := time.ParseInLocation("2006-01-02", now.Format("2006-01-02"), loc)
	return int(t.Unix() / 86400)
}

func today() string {
	return time.Now().UTC().Format("2006-01-02")
}

func yesterday() string {
	return time.Now().UTC().AddDate(0, 0, -1).Format("2006-01-02")
}

// ─────────────────────────────────────────────
// GET /api/v1/quest/daily (PUBLIC)
// Zwraca 3 questy dzienne: po jednym z XP 10, 15, 25
// Rotacja deterministyczna co 24h o 12:00 Warsaw
// ─────────────────────────────────────────────

func GetDailyQuestHandler(c *gin.Context) {
	key := dailyKey()
	result := make([]questPublic, 0, 3)

	for _, xp := range []int{10, 15, 25} {
		var pool []models.Quest
		if err := database.DB.Where("xp = ?", xp).Find(&pool).Error; err != nil || len(pool) == 0 {
			continue
		}
		q := pool[key%len(pool)]
		result = append(result, toPublic(q))
	}

	if len(result) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No daily quests available"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"quests": result})
}

// ─────────────────────────────────────────────
// GET /api/v1/quests (PUBLIC)
// ─────────────────────────────────────────────

func ListQuestsHandler(c *gin.Context) {
	query := database.DB.Model(&models.Quest{})

	if t := c.Query("type"); t != "" {
		query = query.Where("type = ?", t)
	}
	if tr := c.Query("track"); tr != "" {
		query = query.Where("track = ?", tr)
	}
	if d := c.Query("difficulty"); d != "" {
		query = query.Where("difficulty = ?", d)
	}

	var quests []models.Quest
	if err := query.Find(&quests).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch quests"})
		return
	}

	result := make([]questPublic, len(quests))
	for i, q := range quests {
		result[i] = toPublic(q)
	}
	c.JSON(http.StatusOK, gin.H{"quests": result})
}

// ─────────────────────────────────────────────
// POST /api/v1/quest/:id/submit (PROTECTED)
// ─────────────────────────────────────────────

type submitRequest struct {
	AnswerKey string `json:"answer_key" binding:"required"`
}

func SubmitQuestHandler(c *gin.Context) {
	userID := getUserID(c)
	questID := c.Param("id")

	var req submitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "answer_key is required"})
		return
	}

	var q models.Quest
	if err := database.DB.First(&q, "id = ?", questID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Quest not found"})
		return
	}

	isCorrect := req.AnswerKey == q.CorrectKey

	// Guest — sprawdź tylko, nic nie zapisuj
	if userID == "" {
		c.JSON(http.StatusOK, gin.H{
			"is_correct":     isCorrect,
			"correct_key":    q.CorrectKey,
			"xp_earned":      0,
			"explanation_en": q.ExplainEN,
			"explanation_pl": q.ExplainPL,
			"stats":          gin.H{"total_xp": 0, "current_streak": 0},
		})
		return
	}

	// Idempotency — raz na quest na zawsze
	var existing models.QuestAttempt
	if database.DB.Where("user_id = ? AND quest_id = ?", userID, questID).First(&existing).Error == nil {
		var stats models.UserQuestStats
		database.DB.Where("user_id = ?", userID).First(&stats)
		c.JSON(http.StatusOK, gin.H{
			"is_correct":     existing.IsCorrect,
			"correct_key":    q.CorrectKey,
			"xp_earned":      existing.XPEarned,
			"explanation_en": q.ExplainEN,
			"explanation_pl": q.ExplainPL,
			"stats":          gin.H{"total_xp": stats.TotalXP, "current_streak": stats.CurrentStreak},
		})
		return
	}

	xpEarned := 0
	if isCorrect {
		xpEarned = q.XP
	}

	id, _ := gonanoid.New()
	database.DB.Create(&models.QuestAttempt{
		ID:          id,
		UserID:      userID,
		QuestID:     questID,
		AnswerKey:   req.AnswerKey,
		IsCorrect:   isCorrect,
		XPEarned:    xpEarned,
		AttemptedAt: time.Now().UTC(),
	})

	var stats models.UserQuestStats
	database.DB.FirstOrCreate(&stats, models.UserQuestStats{UserID: userID})

	stats.TotalXP += xpEarned
	stats.TotalAttempts++
	if isCorrect {
		stats.TotalCorrect++
	}

	todayStr := today()
	switch stats.LastActiveDate {
	case todayStr:
		// already active today — no change
	case yesterday():
		stats.CurrentStreak++
	default:
		stats.CurrentStreak = 1
	}
	stats.LastActiveDate = todayStr
	if stats.CurrentStreak > stats.LongestStreak {
		stats.LongestStreak = stats.CurrentStreak
	}
	stats.UpdatedAt = time.Now().UTC()
	database.DB.Save(&stats)

	c.JSON(http.StatusOK, gin.H{
		"is_correct":     isCorrect,
		"correct_key":    q.CorrectKey,
		"xp_earned":      xpEarned,
		"explanation_en": q.ExplainEN,
		"explanation_pl": q.ExplainPL,
		"stats":          gin.H{"total_xp": stats.TotalXP, "current_streak": stats.CurrentStreak},
	})
}

// ─────────────────────────────────────────────
// GET /api/v1/quest/stats (PROTECTED)
// ─────────────────────────────────────────────

func GetUserStatsHandler(c *gin.Context) {
	userID := getUserID(c)
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Login required"})
		return
	}

	var stats models.UserQuestStats
	database.DB.FirstOrCreate(&stats, models.UserQuestStats{UserID: userID})

	c.JSON(http.StatusOK, stats)
}

// ─────────────────────────────────────────────
// GET /api/v1/quest/:id/result (PROTECTED)
// ─────────────────────────────────────────────

func GetQuestResultHandler(c *gin.Context) {
	userID := getUserID(c)
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Login required"})
		return
	}

	questID := c.Param("id")

	var attempt models.QuestAttempt
	if err := database.DB.
		Where("user_id = ? AND quest_id = ?", userID, questID).
		Order("attempted_at DESC").
		First(&attempt).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"attempted": false})
		return
	}

	var quest models.Quest
	database.DB.First(&quest, "id = ?", questID)

	c.JSON(http.StatusOK, gin.H{
		"attempted":      true,
		"attempt":        attempt,
		"correct_key":    quest.CorrectKey,
		"explanation_en": quest.ExplainEN,
		"explanation_pl": quest.ExplainPL,
	})
}
