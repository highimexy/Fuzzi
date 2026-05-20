package lessons

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
)

func ListHandler(c *gin.Context) {
	var lessons []models.Lesson

	result := database.DB.Find(&lessons)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch lessons"})
		return
	}

	c.JSON(http.StatusOK, lessons)
}

func GetHandler(c *gin.Context) {
	id := c.Param("id")
	var lesson models.Lesson

	result := database.DB.Where("id = ?", id).First(&lesson)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lesson not found"})
		return
	}

	c.JSON(http.StatusOK, lesson)
}

type SubmitRequest struct {
	Answer      string  `json:"answer"`
	Confidence  *string `json:"confidence"`
	NeedsReview bool    `json:"needs_review"`
}

func SubmitHandler(c *gin.Context) {
	lessonID := c.Param("id")
	userID := "mock-user-123" // TODO: Zamienić na ID z tokena JWT/middleware

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

	isCorrect := true
	score := 100

	var progress models.LessonProgress
	database.DB.Where(models.LessonProgress{UserID: userID, LessonID: lessonID}).
		Assign(models.LessonProgress{
			Completed: isCorrect,
			Score:     score,
			UpdatedAt: time.Now(),
		}).FirstOrCreate(&progress)

	c.JSON(http.StatusOK, gin.H{
		"status":   "success",
		"progress": progress,
		"correct":  isCorrect,
	})
}

func ProgressHandler(c *gin.Context) {
	lessonID := c.Param("id")
	userID := "mock-user-123"

	var progress models.LessonProgress
	result := database.DB.Where("user_id = ? AND lesson_id = ?", userID, lessonID).First(&progress)

	if result.Error != nil {
		c.JSON(http.StatusOK, gin.H{
			"completed": false,
			"score":     0,
			"attempts":  0,
		})
		return
	}

	c.JSON(http.StatusOK, progress)
}
