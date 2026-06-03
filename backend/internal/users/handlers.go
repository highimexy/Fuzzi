package users

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
)

// GET /api/v1/users/:id
func GetPublicProfileHandler(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var postCount int64
	database.DB.Model(&models.DiscussPost{}).Where("user_id = ?", user.Auth0ID).Count(&postCount)

	c.JSON(http.StatusOK, gin.H{
		"id":         user.ID,
		"name":       user.Name,
		"auth0_id":   user.Auth0ID,
		"created_at": user.CreatedAt,
		"post_count": postCount,
	})
}
