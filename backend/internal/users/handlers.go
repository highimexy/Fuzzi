package users

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-gonic/gin"
	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
)

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

	var stats models.UserQuestStats
	database.DB.FirstOrCreate(&stats, models.UserQuestStats{UserID: user.Auth0ID})

	c.JSON(http.StatusOK, gin.H{
		"id":             user.ID,
		"name":           user.Name,
		"auth0_id":       user.Auth0ID,
		"bio":            user.Bio,
		"avatar_url":     user.AvatarURL,
		"location":       user.Location,
		"website":        user.Website,
		"twitter":        user.Twitter,
		"linkedin":       user.LinkedIn,
		"github":         user.GitHub,
		"karma":          user.Karma,
		"created_at":     user.CreatedAt,
		"post_count":     postCount,
		"total_xp":       stats.TotalXP,
		"current_streak": stats.CurrentStreak,
		"total_correct":  stats.TotalCorrect,
	})
}

// GET /api/v1/users/:id/posts
func GetPublicProfilePostsHandler(c *gin.Context) {
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

	var posts []models.DiscussPost
	database.DB.Where("user_id = ?", user.Auth0ID).Order("created_at DESC").Find(&posts)

	c.JSON(http.StatusOK, gin.H{"posts": posts})
}

// GET /api/v1/me/profile
func GetMyProfileHandler(c *gin.Context) {
	auth0ID := getUserID(c)
	if auth0ID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var user models.User
	if err := database.DB.Where("auth0_id = ?", auth0ID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var stats models.UserQuestStats
	database.DB.FirstOrCreate(&stats, models.UserQuestStats{UserID: auth0ID})

	var postCount int64
	database.DB.Model(&models.DiscussPost{}).Where("user_id = ?", auth0ID).Count(&postCount)

	var rank int64
	database.DB.Model(&models.UserQuestStats{}).Where("total_xp > ?", stats.TotalXP).Count(&rank)
	rank = rank + 1

	c.JSON(http.StatusOK, gin.H{
		"user": user,
		"stats": gin.H{
			"total_xp":       stats.TotalXP,
			"current_streak": stats.CurrentStreak,
			"longest_streak": stats.LongestStreak,
			"total_correct":  stats.TotalCorrect,
			"total_attempts": stats.TotalAttempts,
		},
		"post_count": postCount,
		"rank":       rank,
	})
}

type UpdateProfileReq struct {
	Name      *string `json:"name"`
	Bio       *string `json:"bio"`
	Location  *string `json:"location"`
	Website   *string `json:"website"`
	Twitter   *string `json:"twitter"`
	LinkedIn  *string `json:"linkedin"`
	GitHub    *string `json:"github"`
	AvatarURL *string `json:"avatar_url"`
}

// PUT /api/v1/me/profile
func UpdateMyProfileHandler(c *gin.Context) {
	auth0ID := getUserID(c)
	if auth0ID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req UpdateProfileReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	updates := map[string]interface{}{}
	if req.Name != nil {
		if len(*req.Name) > 60 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Name too long (max 60)"})
			return
		}
		updates["name"] = *req.Name
	}
	if req.Bio != nil {
		if len(*req.Bio) > 500 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Bio too long (max 500)"})
			return
		}
		updates["bio"] = *req.Bio
	}
	if req.Location != nil {
		updates["location"] = *req.Location
	}
	if req.Website != nil {
		updates["website"] = *req.Website
	}
	if req.Twitter != nil {
		updates["twitter"] = *req.Twitter
	}
	if req.LinkedIn != nil {
		updates["linkedin"] = *req.LinkedIn
	}
	if req.GitHub != nil {
		updates["github"] = *req.GitHub
	}
	if req.AvatarURL != nil {
		updates["avatar_url"] = *req.AvatarURL
	}

	if len(updates) == 0 {
		c.JSON(http.StatusOK, gin.H{"updated": false})
		return
	}

	if err := database.DB.Model(&models.User{}).Where("auth0_id = ?", auth0ID).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	var user models.User
	database.DB.Where("auth0_id = ?", auth0ID).First(&user)
	c.JSON(http.StatusOK, gin.H{"user": user})
}

const maxAvatarSize = 2 << 20 // 2MB

// POST /api/v1/me/avatar
func UploadAvatarHandler(c *gin.Context) {
	auth0ID := getUserID(c)
	if auth0ID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	file, header, err := c.Request.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file provided"})
		return
	}
	defer file.Close()

	if header.Size > maxAvatarSize {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File too large (max 2MB)"})
		return
	}

	// Detect real MIME type from magic bytes, not from the filename
	buf := make([]byte, 512)
	n, err := file.Read(buf)
	if err != nil && err != io.EOF {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot read file"})
		return
	}
	contentType := http.DetectContentType(buf[:n])

	var ext string
	switch contentType {
	case "image/jpeg":
		ext = ".jpg"
	case "image/png":
		ext = ".png"
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only JPG and PNG files are allowed"})
		return
	}

	if _, err := file.Seek(0, io.SeekStart); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process file"})
		return
	}

	var user models.User
	if err := database.DB.Where("auth0_id = ?", auth0ID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	uploadsDir := "./uploads/avatars"
	if err := os.MkdirAll(uploadsDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Storage error"})
		return
	}

	// Remove the previous avatar file using the exact path stored in DB
	if user.AvatarURL != "" {
		os.Remove("." + user.AvatarURL)
	}

	filename := fmt.Sprintf("%d%s", user.ID, ext)
	dst, err := os.Create(filepath.Join(uploadsDir, filename))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	avatarURL := fmt.Sprintf("/uploads/avatars/%s", filename)
	database.DB.Model(&models.User{}).Where("auth0_id = ?", auth0ID).Update("avatar_url", avatarURL)

	c.JSON(http.StatusOK, gin.H{"avatar_url": avatarURL})
}

// DELETE /api/v1/me
func DeleteMyAccountHandler(c *gin.Context) {
	auth0ID := getUserID(c)
	if auth0ID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if err := database.DB.Where("auth0_id = ?", auth0ID).Delete(&models.User{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete account"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"deleted": true})
}
