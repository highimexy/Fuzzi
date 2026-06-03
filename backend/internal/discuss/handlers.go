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

var allowedCategories = map[string]bool{
	"general":  true,
	"qa":       true,
	"career":   true,
	"feedback": true,
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

type postResponse struct {
	models.DiscussPost
	HasVoted bool `json:"has_voted"`
}

// GET /api/v1/discuss/posts
func ListHandler(c *gin.Context) {
	sort := c.DefaultQuery("sort", "newest")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	category := c.Query("category")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 20
	}

	base := database.DB.Model(&models.DiscussPost{})
	if category != "" && category != "for-you" && category != "all" {
		base = base.Where("category = ?", category)
	}

	var total int64
	base.Count(&total)

	orderCol := "created_at DESC"
	if sort == "votes" {
		orderCol = "upvotes DESC, created_at DESC"
	}

	var posts []models.DiscussPost
	if err := base.
		Order(orderCol).
		Preload("Author").
		Limit(limit).
		Offset((page-1)*limit).
		Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}

	userID := getUserID(c)
	result := make([]postResponse, len(posts))
	for i, p := range posts {
		result[i] = postResponse{DiscussPost: p}
	}

	if userID != "" && len(posts) > 0 {
		postIDs := make([]string, len(posts))
		for i, p := range posts {
			postIDs[i] = p.ID
		}
		var votes []models.DiscussVote
		database.DB.Where("post_id IN ? AND user_id = ?", postIDs, userID).Find(&votes)
		votedSet := make(map[string]bool, len(votes))
		for _, v := range votes {
			votedSet[v.PostID] = true
		}
		for i := range result {
			result[i].HasVoted = votedSet[result[i].ID]
		}
	}

	c.JSON(http.StatusOK, gin.H{"posts": result, "total": total})
}

type createPostRequest struct {
	Title    string   `json:"title"`
	Body     string   `json:"body"`
	Tags     []string `json:"tags"`
	Category string   `json:"category"`
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
	cat := strings.ToLower(strings.TrimSpace(req.Category))
	if cat == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Category is required"})
		return
	}
	if !allowedCategories[cat] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category"})
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
		UserID:   userID,
		Title:    req.Title,
		Body:     req.Body,
		Tags:     datatypes.JSON(tagsJSON),
		Category: cat,
	}

	if err := database.DB.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}

	database.DB.Preload("Author").First(&post, "id = ?", post.ID)
	c.JSON(http.StatusCreated, postResponse{DiscussPost: post})
}

// GET /api/v1/discuss/posts/:id
func GetHandler(c *gin.Context) {
	id := c.Param("id")
	userID := getUserID(c)

	var post models.DiscussPost
	if err := database.DB.Preload("Author").First(&post, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	if userID != post.UserID {
		database.DB.Model(&post).UpdateColumn("views", gorm.Expr("views + 1"))
		post.Views++
	}

	var comments []models.DiscussComment
	database.DB.Where("post_id = ?", id).Order("created_at ASC").Preload("Author").Find(&comments)

	hasVoted := false
	if userID != "" {
		var vote models.DiscussVote
		err := database.DB.Where("post_id = ? AND user_id = ?", id, userID).First(&vote).Error
		hasVoted = err == nil
	}

	c.JSON(http.StatusOK, gin.H{"post": postResponse{DiscussPost: post, HasVoted: hasVoted}, "comments": comments})
}

// POST /api/v1/discuss/posts/:id/vote
func VoteHandler(c *gin.Context) {
	userID := getUserID(c)
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Login required"})
		return
	}

	id := c.Param("id")
	var post models.DiscussPost
	if err := database.DB.First(&post, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	// Ensure user record exists (FK constraint)
	email := auth.FetchEmailFromUserInfo(strings.TrimPrefix(c.GetHeader("Authorization"), "Bearer "))
	var user models.User
	if res := database.DB.Where("auth0_id = ?", userID).First(&user); res.Error != nil {
		user = models.User{Auth0ID: userID, Email: email}
		if err := database.DB.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to provision user"})
			return
		}
	}

	hasVoted := false
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		var vote models.DiscussVote
		err := tx.Where("post_id = ? AND user_id = ?", id, userID).First(&vote).Error
		if err == nil {
			// Already voted — remove vote
			if err := tx.Delete(&vote).Error; err != nil {
				return err
			}
			return tx.Model(&post).UpdateColumn("upvotes", gorm.Expr("upvotes - 1")).Error
		}
		// Not voted — add vote
		hasVoted = true
		if err := tx.Create(&models.DiscussVote{PostID: id, UserID: userID}).Error; err != nil {
			return err
		}
		return tx.Model(&post).UpdateColumn("upvotes", gorm.Expr("upvotes + 1")).Error
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Vote failed"})
		return
	}

	database.DB.First(&post, "id = ?", id)
	c.JSON(http.StatusOK, gin.H{"upvotes": post.Upvotes, "has_voted": hasVoted})
}

type updatePostRequest struct {
	Title    string   `json:"title"`
	Body     string   `json:"body"`
	Tags     []string `json:"tags"`
	Category string   `json:"category"`
}

// PUT /api/v1/discuss/posts/:id
func UpdateHandler(c *gin.Context) {
	userID := getUserID(c)
	id := c.Param("id")

	var post models.DiscussPost
	if err := database.DB.First(&post, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}
	if post.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	var req updatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	if req.Title != "" {
		if len(req.Title) > 200 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Title must be at most 200 characters"})
			return
		}
		post.Title = req.Title
	}
	if req.Body != "" {
		if len(req.Body) < 20 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Body must be at least 20 characters"})
			return
		}
		post.Body = req.Body
	}
	if req.Category != "" {
		cat := strings.ToLower(strings.TrimSpace(req.Category))
		if !allowedCategories[cat] {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category"})
			return
		}
		post.Category = cat
	}
	if req.Tags != nil {
		if len(req.Tags) > 5 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Maximum 5 tags allowed"})
			return
		}
		tagsJSON, err := json.Marshal(req.Tags)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process tags"})
			return
		}
		post.Tags = datatypes.JSON(tagsJSON)
	}

	if err := database.DB.Save(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update post"})
		return
	}
	database.DB.Preload("Author").First(&post, "id = ?", post.ID)
	c.JSON(http.StatusOK, postResponse{DiscussPost: post})
}

// DELETE /api/v1/discuss/posts/:id
func DeleteHandler(c *gin.Context) {
	userID := getUserID(c)
	id := c.Param("id")

	var post models.DiscussPost
	if err := database.DB.First(&post, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}
	if post.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	database.DB.Delete(&post)
	c.Status(http.StatusNoContent)
}

// GET /api/v1/discuss/posts/:id/comments
func ListCommentsHandler(c *gin.Context) {
	id := c.Param("id")
	var comments []models.DiscussComment
	database.DB.Where("post_id = ?", id).Order("created_at ASC").Preload("Author").Find(&comments)
	c.JSON(http.StatusOK, gin.H{"comments": comments})
}

type createCommentRequest struct {
	Body string `json:"body"`
}

// POST /api/v1/discuss/posts/:id/comments
func CreateCommentHandler(c *gin.Context) {
	userID := getUserID(c)
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Login required"})
		return
	}

	id := c.Param("id")
	var post models.DiscussPost
	if err := database.DB.First(&post, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	var req createCommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}
	body := strings.TrimSpace(req.Body)
	if body == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Body is required"})
		return
	}
	if len(body) > 2000 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Comment is too long (max 2000 characters)"})
		return
	}

	email := auth.FetchEmailFromUserInfo(strings.TrimPrefix(c.GetHeader("Authorization"), "Bearer "))
	var user models.User
	if res := database.DB.Where("auth0_id = ?", userID).First(&user); res.Error != nil {
		user = models.User{Auth0ID: userID, Email: email}
		if err := database.DB.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to provision user"})
			return
		}
	}

	var comment models.DiscussComment
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		comment = models.DiscussComment{PostID: id, UserID: userID, Body: body}
		if err := tx.Create(&comment).Error; err != nil {
			return err
		}
		return tx.Model(&post).UpdateColumn("comment_count", gorm.Expr("comment_count + 1")).Error
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
		return
	}

	database.DB.Preload("Author").First(&comment, "id = ?", comment.ID)
	c.JSON(http.StatusCreated, comment)
}

// DELETE /api/v1/discuss/comments/:commentId
func DeleteCommentHandler(c *gin.Context) {
	userID := getUserID(c)
	commentID := c.Param("commentId")

	var comment models.DiscussComment
	if err := database.DB.First(&comment, "id = ?", commentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}
	if comment.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	var post models.DiscussPost
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(&comment).Error; err != nil {
			return err
		}
		if err := tx.First(&post, "id = ?", comment.PostID).Error; err != nil {
			return nil // post may have been deleted
		}
		return tx.Model(&post).UpdateColumn("comment_count", gorm.Expr("GREATEST(comment_count - 1, 0)")).Error
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete comment"})
		return
	}

	c.Status(http.StatusNoContent)
}

// GET /api/v1/discuss/my-posts
func ListMyPostsHandler(c *gin.Context) {
	userID := getUserID(c)
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Login required"})
		return
	}

	var posts []models.DiscussPost
	database.DB.Where("user_id = ?", userID).Order("created_at DESC").Preload("Author").Find(&posts)

	result := make([]postResponse, len(posts))
	for i, p := range posts {
		result[i] = postResponse{DiscussPost: p}
	}

	c.JSON(http.StatusOK, gin.H{"posts": result, "total": int64(len(posts))})
}
