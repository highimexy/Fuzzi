package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-gonic/gin"
	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
)

type CustomClaims struct {
	Email string `json:"email"`
	validator.CustomClaims
}

func (c *CustomClaims) Validate(ctx context.Context) error {
	return nil
}

// GetClaimsEmail returns the email from the JWT custom claims, or "" if absent.
// Auth0 typically puts email in id_token, not access_token, so this often returns "".
func GetClaimsEmail(c *gin.Context) string {
	raw, exists := c.Get("user_claims")
	if !exists {
		return ""
	}
	validated, ok := raw.(*validator.ValidatedClaims)
	if !ok || validated.CustomClaims == nil {
		return ""
	}
	cc, ok := validated.CustomClaims.(*CustomClaims)
	if !ok {
		return ""
	}
	return cc.Email
}

// FetchEmailFromUserInfo calls Auth0's /userinfo endpoint with the bearer token
// to reliably obtain the user's email regardless of access token format.
func FetchEmailFromUserInfo(bearerToken string) string {
	domain := os.Getenv("AUTH0_DOMAIN")
	req, err := http.NewRequest("GET", fmt.Sprintf("https://%s/userinfo", domain), nil)
	if err != nil {
		return ""
	}
	req.Header.Set("Authorization", "Bearer "+bearerToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		return ""
	}
	defer resp.Body.Close()

	var info struct {
		Email string `json:"email"`
	}
	json.NewDecoder(resp.Body).Decode(&info)
	return info.Email
}

func resolveEmail(c *gin.Context) string {
	if email := GetClaimsEmail(c); email != "" {
		return email
	}
	token := strings.TrimPrefix(c.GetHeader("Authorization"), "Bearer ")
	return FetchEmailFromUserInfo(token)
}

func SyncUserHandler(c *gin.Context) {
	tokenClaims := c.MustGet("user_claims").(*validator.ValidatedClaims)
	auth0ID := tokenClaims.RegisteredClaims.Subject
	userEmail := resolveEmail(c)

	var user models.User
	result := database.DB.Where("auth0_id = ?", auth0ID).First(&user)

	if result.Error != nil {
		user = models.User{Auth0ID: auth0ID, Email: userEmail}
		if err := database.DB.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Nie udało się stworzyć użytkownika"})
			return
		}
	} else if userEmail != "" && user.Email != userEmail {
		database.DB.Model(&user).UpdateColumn("email", userEmail)
		user.Email = userEmail
	}

	c.JSON(http.StatusOK, user)
}
