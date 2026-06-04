package ranking

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/highimexy/it-shit/backend/internal/database"
)

type RankingRow struct {
	Auth0ID      string `json:"auth0_id"`
	UserID       uint   `json:"user_id"`
	Name         string `json:"name"`
	AvatarURL    string `json:"avatar_url"`
	TotalXP      int    `json:"total_xp"`
	LessonsSolved int   `json:"lessons_solved"`
}

// GET /api/v1/ranking
func GetRankingHandler(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if limit < 1 || limit > 100 {
		limit = 10
	}

	var rows []RankingRow
	database.DB.
		Table("user_quest_stats AS s").
		Select("u.auth0_id, u.id AS user_id, u.name, u.avatar_url, s.total_xp, s.total_correct AS lessons_solved").
		Joins("JOIN users u ON u.auth0_id = s.user_id").
		Where("u.deleted_at IS NULL").
		Order("s.total_xp DESC").
		Limit(limit).
		Scan(&rows)

	c.JSON(http.StatusOK, gin.H{"ranking": rows})
}
