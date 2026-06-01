package lessons

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-gonic/gin"
	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
	"gorm.io/gorm"
)

// ─────────────────────────────────────────────
// TRACK HANDLER
// GET /api/v1/tracks/:track/groups
// Zwraca LessonGroup[] z progressem dla zalogowanego usera
// ─────────────────────────────────────────────

type LessonGroupResponse struct {
	models.LessonGroup
	SubLessonCount int `json:"sub_lesson_count"`
	CompletedCount int `json:"completed_count"`
}

func TrackHandler(c *gin.Context) {
	track := c.Param("track")

	var groups []models.LessonGroup
	if err := database.DB.
		Where("track = ?", track).
		Order("\"order\" ASC").
		Find(&groups).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch groups"})
		return
	}

	// Pobierz userID z kontekstu (nil jeśli niezalogowany)
	userID := getUserID(c)

	result := make([]LessonGroupResponse, 0, len(groups))

	for _, group := range groups {
		resp := LessonGroupResponse{LessonGroup: group}

		// Policz sub-lekcje dla grupy
		var subCount int64
		database.DB.Model(&models.Lesson{}).
			Where("lesson_group_id = ?", group.ID).
			Count(&subCount)
		resp.SubLessonCount = int(subCount)

		// Policz ukończone (tylko dla zalogowanych)
		if userID != "" {
			var completedCount int64
			database.DB.Model(&models.LessonProgress{}).
				Joins("JOIN lessons ON lessons.id = lesson_progresses.lesson_id").
				Where("lesson_progresses.user_id = ? AND lessons.lesson_group_id = ? AND lesson_progresses.completed = true", userID, group.ID).
				Count(&completedCount)
			resp.CompletedCount = int(completedCount)
		}

		result = append(result, resp)
	}

	c.JSON(http.StatusOK, result)
}

// ─────────────────────────────────────────────
// GROUP HANDLER
// GET /api/v1/groups/:groupId
// Zwraca LessonGroup z listą sub-lekcji
// ─────────────────────────────────────────────

func GroupHandler(c *gin.Context) {
	groupID := c.Param("groupId")

	var group models.LessonGroup
	if err := database.DB.
		Preload("Lessons", func(db *gorm.DB) *gorm.DB {
			return db.Order("\"order\" ASC")
		}).
		First(&group, "id = ?", groupID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
		return
	}

	c.JSON(http.StatusOK, group)
}

// ─────────────────────────────────────────────
// GROUP PROGRESS HANDLER
// GET /api/v1/groups/:groupId/progress
// Zwraca postęp zalogowanego usera dla grupy
// ─────────────────────────────────────────────

type GroupProgressResponse struct {
	GroupID   string `json:"group_id"`
	Total     int    `json:"total"`
	Completed int    `json:"completed"`
	Percent   int    `json:"percent"`
}

func GroupProgressHandler(c *gin.Context) {
	groupID := c.Param("groupId")
	userID := getUserID(c)

	if userID == "" {
		c.JSON(http.StatusOK, GroupProgressResponse{GroupID: groupID})
		return
	}

	var total int64
	database.DB.Model(&models.Lesson{}).
		Where("lesson_group_id = ?", groupID).
		Count(&total)

	var completed int64
	database.DB.Model(&models.LessonProgress{}).
		Joins("JOIN lessons ON lessons.id = lesson_progresses.lesson_id").
		Where("lesson_progresses.user_id = ? AND lessons.lesson_group_id = ? AND lesson_progresses.completed = true", userID, groupID).
		Count(&completed)

	percent := 0
	if total > 0 {
		percent = int(completed * 100 / total)
	}

	c.JSON(http.StatusOK, GroupProgressResponse{
		GroupID:   groupID,
		Total:     int(total),
		Completed: int(completed),
		Percent:   percent,
	})
}

// ─────────────────────────────────────────────
// LIST HANDLER (zachowany dla kompatybilności)
// GET /api/v1/lessons
// ─────────────────────────────────────────────

func ListHandler(c *gin.Context) {
	var lessons []models.Lesson
	if err := database.DB.Find(&lessons).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch lessons"})
		return
	}
	c.JSON(http.StatusOK, lessons)
}

// ─────────────────────────────────────────────
// GET HANDLER
// GET /api/v1/lessons/:id
// ─────────────────────────────────────────────

func GetHandler(c *gin.Context) {
	id := c.Param("id")
	var lesson models.Lesson
	if err := database.DB.First(&lesson, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lesson not found"})
		return
	}
	c.JSON(http.StatusOK, lesson)
}

// ─────────────────────────────────────────────
// SUBMIT HANDLER
// POST /api/v1/lessons/:id/submit
// ─────────────────────────────────────────────

type SubmitRequest struct {
	Answer      json.RawMessage `json:"answer"`
	Confidence  *string         `json:"confidence"`
	NeedsReview bool            `json:"needs_review"`
	Locale      string          `json:"locale"`
}

type quizOption struct {
	ID        string `json:"id"`
	IsCorrect bool   `json:"is_correct"`
}

type quizPayload struct {
	Correct string       `json:"correct"`
	Options []quizOption `json:"options"`
}

func xpForDifficulty(difficulty string) int {
	switch difficulty {
	case "intermediate":
		return 20
	case "advanced":
		return 30
	default:
		return 10
	}
}

func SubmitHandler(c *gin.Context) {
	lessonID := c.Param("id")
	userID := getUserID(c)
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Login required to save progress"})
		return
	}

	var req SubmitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	var lesson models.Lesson
	if err := database.DB.First(&lesson, "id = ?", lessonID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lesson not found"})
		return
	}

	// Walidacja odpowiedzi
	rawPayload := lesson.PayloadEN
	if req.Locale == "pl" && len(lesson.PayloadPL) > 2 {
		rawPayload = lesson.PayloadPL
	}

	// Wyciągnij odpowiedź jako string (dla tasków quiz)
	// Dla tasków z odpowiedzią obiektową (CvAudit, Triage itp.) answerStr będzie ""
	var answerStr string
	json.Unmarshal(req.Answer, &answerStr)

	var qp quizPayload
	hasCorrectField := false
	isCorrect := false
	if err := json.Unmarshal(rawPayload, &qp); err == nil {
		if qp.Correct != "" {
			hasCorrectField = true
			isCorrect = answerStr == qp.Correct
		} else {
			// Format 2: correctness encoded per-option via is_correct field
			for _, opt := range qp.Options {
				if opt.IsCorrect {
					hasCorrectField = true
					isCorrect = answerStr == opt.ID
					break
				}
			}
		}
	}

	score := 0
	if isCorrect || !hasCorrectField {
		score = 100
	}

	// Upsert progressu
	var progress models.LessonProgress
	database.DB.Where(models.LessonProgress{
		UserID:   userID,
		LessonID: lessonID,
	}).FirstOrCreate(&progress)

	// XP przyznawane raz:
	// - zadania z polem correct: przy pierwszej prawidłowej odpowiedzi
	// - zadania bez pola correct: przy pierwszym submicie (samo wykonanie = wartość edukacyjna)
	xpEarned := 0
	if progress.XPEarned == 0 && (isCorrect || !hasCorrectField) {
		xpEarned = xpForDifficulty(lesson.Difficulty)

		var stats models.UserQuestStats
		database.DB.FirstOrCreate(&stats, models.UserQuestStats{UserID: userID})
		stats.TotalXP += xpEarned
		stats.UpdatedAt = time.Now().UTC()
		database.DB.Save(&stats)
	}

	updates := map[string]interface{}{
		"completed":  progress.Completed || isCorrect || !hasCorrectField,
		"score":      score,
		"attempts":   progress.Attempts + 1,
		"updated_at": time.Now(),
	}
	if xpEarned > 0 {
		updates["xp_earned"] = xpEarned
	}
	database.DB.Model(&progress).Updates(updates)

	c.JSON(http.StatusOK, gin.H{
		"correct":   isCorrect,
		"score":     score,
		"xp_earned": xpEarned,
		"progress": gin.H{
			"completed": progress.Completed || isCorrect || !hasCorrectField,
			"score":     score,
			"attempts":  progress.Attempts + 1,
			"xp_earned": progress.XPEarned + xpEarned,
		},
	})
}

// ─────────────────────────────────────────────
// PROGRESS HANDLER
// GET /api/v1/lessons/:id/progress
// ─────────────────────────────────────────────

func ProgressHandler(c *gin.Context) {
	lessonID := c.Param("id")
	userID := getUserID(c)

	if userID == "" {
		c.JSON(http.StatusOK, gin.H{"completed": false, "score": 0, "attempts": 0})
		return
	}

	var progress models.LessonProgress
	if err := database.DB.
		Where("user_id = ? AND lesson_id = ?", userID, lessonID).
		First(&progress).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"completed": false, "score": 0, "attempts": 0})
		return
	}

	c.JSON(http.StatusOK, progress)
}

// ─────────────────────────────────────────────
// COMPLETED LESSONS HANDLER
// GET /api/v1/groups/:groupId/completed-lessons (OPTIONAL AUTH)
// Zwraca listę ID ukończonych lekcji w grupie
// ─────────────────────────────────────────────

func GroupCompletedLessonsHandler(c *gin.Context) {
	userID := getUserID(c)
	groupID := c.Param("groupId")

	if userID == "" {
		c.JSON(http.StatusOK, gin.H{"completed": []string{}})
		return
	}

	var lessonIDs []string
	database.DB.Model(&models.Lesson{}).
		Where("lesson_group_id = ?", groupID).
		Pluck("id", &lessonIDs)

	if len(lessonIDs) == 0 {
		c.JSON(http.StatusOK, gin.H{"completed": []string{}})
		return
	}

	var completed []string
	database.DB.Model(&models.LessonProgress{}).
		Where("user_id = ? AND lesson_id IN ? AND completed = true", userID, lessonIDs).
		Pluck("lesson_id", &completed)

	c.JSON(http.StatusOK, gin.H{"completed": completed})
}

// ─────────────────────────────────────────────
// HELPER — pobierz userID z JWT kontekstu
// ─────────────────────────────────────────────

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
