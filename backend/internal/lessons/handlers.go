package lessons

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
)

// ListHandler zwraca listę wszystkich lekcji
func ListHandler(c *gin.Context) {
	var lessons []models.Lesson

	// Pobieramy wszystkie lekcje. GORM zwróci całe obiekty (z title_en i title_pl).
	result := database.DB.Find(&lessons)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch lessons"})
		return
	}

	c.JSON(http.StatusOK, lessons)
}

// GetHandler zwraca konkretną lekcję po jej ID (NanoID)
func GetHandler(c *gin.Context) {
	id := c.Param("id")
	var lesson models.Lesson

	// Szukamy lekcji, której ID pasuje do parametru w URL
	result := database.DB.Where("id = ?", id).First(&lesson)

	if result.Error != nil {
		// Zwracamy 404, jeśli lekcja o takim ID nie istnieje
		c.JSON(http.StatusNotFound, gin.H{"error": "Lesson not found"})
		return
	}

	c.JSON(http.StatusOK, lesson)
}
