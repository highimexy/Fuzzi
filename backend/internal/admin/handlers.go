package admin

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	gonanoid "github.com/matoous/go-nanoid/v2"

	"github.com/gin-gonic/gin"
	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
	"gorm.io/datatypes"
)

type DayCount struct {
	Day   string `json:"day"`
	Count int64  `json:"count"`
}

type DayAttempt struct {
	Day   string `json:"day"`
	Count int64  `json:"count"`
	XP    int64  `json:"xp"`
}

type TrackCount struct {
	Track string `json:"track"`
	Count int64  `json:"count"`
}

// GET /api/v1/admin/charts
func ChartsHandler(c *gin.Context) {
	thirtyDaysAgo := time.Now().AddDate(0, 0, -30)

	var usersByDay []DayCount
	database.DB.Model(&models.User{}).
		Select("created_at::date::text as day, COUNT(*) as count").
		Where("created_at >= ?", thirtyDaysAgo).
		Group("day").
		Order("day").
		Scan(&usersByDay)

	var attemptsByDay []DayAttempt
	database.DB.Model(&models.QuestAttempt{}).
		Select("attempted_at::date::text as day, COUNT(*) as count, COALESCE(SUM(xp_earned), 0) as xp").
		Where("attempted_at >= ?", thirtyDaysAgo).
		Group("day").
		Order("day").
		Scan(&attemptsByDay)

	var correctCount int64
	database.DB.Model(&models.QuestAttempt{}).Where("is_correct = ?", true).Count(&correctCount)

	var topTracks []TrackCount
	database.DB.Table("quest_attempts qa").
		Select("q.track as track, COUNT(*) as count").
		Joins("JOIN quests q ON q.id = qa.quest_id").
		Group("q.track").
		Order("count DESC").
		Limit(6).
		Scan(&topTracks)

	c.JSON(http.StatusOK, gin.H{
		"users_by_day":    usersByDay,
		"attempts_by_day": attemptsByDay,
		"correct_count":   correctCount,
		"top_tracks":      topTracks,
	})
}

func logAudit(adminID, action, target string) {
	database.DB.Create(&models.AdminAuditLog{
		AdminID: adminID,
		Action:  action,
		Target:  target,
	})
}

type userSummary struct {
	ID        uint      `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	Role      string    `json:"role"`
	Karma     int       `json:"karma"`
	CreatedAt time.Time `json:"created_at"`
}

// GET /api/v1/admin/stats
func StatsHandler(c *gin.Context) {
	var userCount, newUsers, postCount, attemptCount int64
	var totalXP int64

	sevenDaysAgo := time.Now().AddDate(0, 0, -7)

	database.DB.Model(&models.User{}).Count(&userCount)
	database.DB.Model(&models.User{}).Where("created_at >= ?", sevenDaysAgo).Count(&newUsers)
	database.DB.Model(&models.DiscussPost{}).Count(&postCount)
	database.DB.Model(&models.UserQuestStats{}).Select("COALESCE(SUM(total_xp), 0)").Scan(&totalXP)
	database.DB.Model(&models.QuestAttempt{}).Count(&attemptCount)

	c.JSON(http.StatusOK, gin.H{
		"user_count":    userCount,
		"new_users_7d":  newUsers,
		"post_count":    postCount,
		"total_xp":      totalXP,
		"attempt_count": attemptCount,
	})
}

// GET /api/v1/admin/users
func ListUsersHandler(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	search := c.Query("search")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 20
	}

	base := database.DB.Model(&models.User{})
	if search != "" {
		like := "%" + search + "%"
		base = base.Where("email ILIKE ? OR name ILIKE ?", like, like)
	}

	var total int64
	base.Count(&total)

	var users []userSummary
	base.Select("id, email, name, role, karma, created_at").
		Order("created_at DESC").
		Limit(limit).
		Offset((page - 1) * limit).
		Scan(&users)

	c.JSON(http.StatusOK, gin.H{"users": users, "total": total})
}

// PATCH /api/v1/admin/users/:id/role
func UpdateUserRoleHandler(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var req struct {
		Role string `json:"role" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "role is required"})
		return
	}
	if req.Role != "user" && req.Role != "admin" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "role must be 'user' or 'admin'"})
		return
	}

	var user models.User
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if user.Role == "admin" && req.Role == "user" {
		var adminCount int64
		database.DB.Model(&models.User{}).Where("role = ?", "admin").Count(&adminCount)
		if adminCount <= 1 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot demote the last admin"})
			return
		}
	}

	if err := database.DB.Model(&user).Update("role", req.Role).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update role"})
		return
	}

	admin := c.MustGet("admin_user").(models.User)
	logAudit(admin.Auth0ID, "role_change", fmt.Sprintf("user:%d role:%s", id, req.Role))

	c.JSON(http.StatusOK, gin.H{"id": id, "role": req.Role})
}

// DELETE /api/v1/admin/users/:id
func DeleteUserHandler(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err := database.DB.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	admin := c.MustGet("admin_user").(models.User)
	logAudit(admin.Auth0ID, "delete_user", fmt.Sprintf("user:%d email:%s", id, user.Email))

	c.Status(http.StatusNoContent)
}

// GET /api/v1/admin/discuss/posts
func ListDiscussPostsHandler(c *gin.Context) {
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

	var posts []models.DiscussPost
	database.DB.Preload("Author").
		Order("created_at DESC").
		Limit(limit).
		Offset((page - 1) * limit).
		Find(&posts)

	c.JSON(http.StatusOK, gin.H{"posts": posts, "total": total})
}

// DELETE /api/v1/admin/discuss/posts/:id
func DeleteDiscussPostHandler(c *gin.Context) {
	id := c.Param("id")

	var post models.DiscussPost
	if err := database.DB.First(&post, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	if err := database.DB.Delete(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete post"})
		return
	}

	admin := c.MustGet("admin_user").(models.User)
	logAudit(admin.Auth0ID, "delete_post", fmt.Sprintf("post:%s", id))

	c.Status(http.StatusNoContent)
}

// GET /api/v1/admin/quests
func ListQuestsHandler(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 20
	}

	var total int64
	database.DB.Model(&models.Quest{}).Count(&total)

	var quests []models.Quest
	database.DB.Order("created_at DESC").
		Limit(limit).
		Offset((page - 1) * limit).
		Find(&quests)

	c.JSON(http.StatusOK, gin.H{"quests": quests, "total": total})
}

type questPayload struct {
	Type       string          `json:"type"`
	Track      string          `json:"track"`
	Difficulty string          `json:"difficulty"`
	TitleEN    string          `json:"title_en"`
	TitlePL    string          `json:"title_pl"`
	BodyEN     string          `json:"body_en"`
	BodyPL     string          `json:"body_pl"`
	Options    json.RawMessage `json:"options"`
	CorrectKey string          `json:"correct_key"`
	ExplainEN  string          `json:"explain_en"`
	ExplainPL  string          `json:"explain_pl"`
	XP         *int            `json:"xp"`
	ActiveDate string          `json:"active_date"`
}

// POST /api/v1/admin/quests
func CreateQuestHandler(c *gin.Context) {
	var req questPayload
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}
	if req.Type == "" || req.Track == "" || req.TitleEN == "" || req.TitlePL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "type, track, title_en and title_pl are required"})
		return
	}

	xp := 10
	if req.XP != nil {
		xp = *req.XP
	}

	id, _ := gonanoid.New()
	quest := models.Quest{
		ID:         id,
		Type:       req.Type,
		Track:      req.Track,
		Difficulty: req.Difficulty,
		TitleEN:    req.TitleEN,
		TitlePL:    req.TitlePL,
		BodyEN:     req.BodyEN,
		BodyPL:     req.BodyPL,
		Options:    datatypes.JSON(req.Options),
		CorrectKey: req.CorrectKey,
		ExplainEN:  req.ExplainEN,
		ExplainPL:  req.ExplainPL,
		XP:         xp,
		ActiveDate: req.ActiveDate,
	}

	if err := database.DB.Create(&quest).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create quest"})
		return
	}

	c.JSON(http.StatusCreated, quest)
}

// PUT /api/v1/admin/quests/:id
func UpdateQuestHandler(c *gin.Context) {
	id := c.Param("id")

	var quest models.Quest
	if err := database.DB.First(&quest, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Quest not found"})
		return
	}

	var req questPayload
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	updates := map[string]interface{}{}
	if req.Type != "" {
		updates["type"] = req.Type
	}
	if req.Track != "" {
		updates["track"] = req.Track
	}
	if req.Difficulty != "" {
		updates["difficulty"] = req.Difficulty
	}
	if req.TitleEN != "" {
		updates["title_en"] = req.TitleEN
	}
	if req.TitlePL != "" {
		updates["title_pl"] = req.TitlePL
	}
	if req.BodyEN != "" {
		updates["body_en"] = req.BodyEN
	}
	if req.BodyPL != "" {
		updates["body_pl"] = req.BodyPL
	}
	if len(req.Options) > 0 && string(req.Options) != "null" {
		updates["options"] = datatypes.JSON(req.Options)
	}
	if req.CorrectKey != "" {
		updates["correct_key"] = req.CorrectKey
	}
	if req.ExplainEN != "" {
		updates["explain_en"] = req.ExplainEN
	}
	if req.ExplainPL != "" {
		updates["explain_pl"] = req.ExplainPL
	}
	if req.XP != nil {
		updates["xp"] = *req.XP
	}
	if req.ActiveDate != "" {
		updates["active_date"] = req.ActiveDate
	}

	if err := database.DB.Model(&quest).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update quest"})
		return
	}

	database.DB.First(&quest, "id = ?", id)
	c.JSON(http.StatusOK, quest)
}
