package discuss

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-gonic/gin"
	"github.com/highimexy/it-shit/backend/internal/auth"
	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
	"gorm.io/datatypes"
	"gorm.io/gorm"
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

// GET /api/v1/discuss/posts
func ListHandler(c *gin.Context) {
	sort := c.DefaultQuery("sort", "newest")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 20
	}

	var total int64
	database.DB.Model(&models.DiscussPost{}).Count(&total)

	orderCol := "created_at DESC"
	if sort == "votes" {
		orderCol = "upvotes DESC"
	}

	var posts []models.DiscussPost
	if err := database.DB.
		Model(&models.DiscussPost{}).
		Order(orderCol).
		Preload("Author").
		Limit(limit).
		Offset((page-1)*limit).
		Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"posts": posts, "total": total})
}

type createPostRequest struct {
	Title string   `json:"title"`
	Body  string   `json:"body"`
	Tags  []string `json:"tags"`
}

// POST /api/v1/discuss/posts
func CreateHandler(c *gin.Context) {
	userID := getUserID(c)
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Login required"})
		return
	}

	var req createPostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	if req.Title == "" || len(req.Title) > 200 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title is required and must be at most 200 characters"})
		return
	}
	if len(req.Body) < 20 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Body must be at least 20 characters"})
		return
	}
	if len(req.Tags) > 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Maximum 5 tags allowed"})
		return
	}

	tags := req.Tags
	if tags == nil {
		tags = []string{}
	}
	tagsJSON, err := json.Marshal(tags)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process tags"})
		return
	}

	// Ensure the user record exists so the FK constraint is satisfied.
	email := auth.FetchEmailFromUserInfo(strings.TrimPrefix(c.GetHeader("Authorization"), "Bearer "))
	var user models.User
	if res := database.DB.Where("auth0_id = ?", userID).First(&user); res.Error != nil {
		user = models.User{Auth0ID: userID, Email: email}
		if err := database.DB.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to provision user"})
			return
		}
	}

	post := models.DiscussPost{
		UserID: userID,
		Title:  req.Title,
		Body:   req.Body,
		Tags:   datatypes.JSON(tagsJSON),
	}

	if err := database.DB.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}

	database.DB.Preload("Author").First(&post, "id = ?", post.ID)

	c.JSON(http.StatusCreated, post)
}

// GET /api/v1/discuss/posts/:id
func GetHandler(c *gin.Context) {
	id := c.Param("id")

	var post models.DiscussPost
	if err := database.DB.First(&post, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	database.DB.Model(&post).UpdateColumn("views", gorm.Expr("views + 1"))
	database.DB.Preload("Author").First(&post, "id = ?", id)

	c.JSON(http.StatusOK, post)
}
