package auth

import (
	"net/http"

	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-gonic/gin"
	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
)

// EnsureAdmin must be used after EnsureValidToken. It loads the user from DB
// and aborts with 403 if the user's role is not "admin".
func EnsureAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		raw, exists := c.Get("user_claims")
		if !exists {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
			return
		}
		claims, ok := raw.(*validator.ValidatedClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
			return
		}

		var user models.User
		if err := database.DB.Where("auth0_id = ?", claims.RegisteredClaims.Subject).First(&user).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
			return
		}
		if user.Role != "admin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
			return
		}

		c.Set("admin_user", user)
		c.Next()
	}
}
