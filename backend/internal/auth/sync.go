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
	Email string
	validator.CustomClaims
}

func (c *CustomClaims) Validate(ctx context.Context) error {
	return nil
}

// UnmarshalJSON extracts email from a namespaced custom claim injected by an Auth0 Action,
// falling back to the standard "email" claim if the namespaced one is absent.
//
// TODO: In Auth0 Dashboard → Actions → Flows → Login, add an Action that injects:
//
//	api.accessToken.setCustomClaim("https://" + event.request.hostname + "/email", event.user.email)
//
// This lets GetClaimsEmail() return the email from the token itself, avoiding
// the /userinfo roundtrip (FetchEmailFromUserInfo) on every authenticated request.
func (c *CustomClaims) UnmarshalJSON(data []byte) error {
	var raw map[string]interface{}
	if err := json.Unmarshal(data, &raw); err != nil {
		return err
	}
	namespace := "https://" + os.Getenv("AUTH0_DOMAIN") + "/"
	if v, ok := raw[namespace+"email"].(string); ok && v != "" {
		c.Email = v
	} else if v, ok := raw["email"].(string); ok {
		c.Email = v
	}
	return nil
}

// GetClaimsEmail returns the email from the JWT custom claims, or "" if absent.
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

// EnsureUser finds or creates the DB user record for the authenticated request.
// It is the single source of truth for user provisioning across all handlers.
func EnsureUser(c *gin.Context) (models.User, error) {
	raw, exists := c.Get("user_claims")
	if !exists {
		return models.User{}, fmt.Errorf("no user claims in context")
	}
	tokenClaims, ok := raw.(*validator.ValidatedClaims)
	if !ok {
		return models.User{}, fmt.Errorf("invalid claims type")
	}
	auth0ID := tokenClaims.RegisteredClaims.Subject
	email := resolveEmail(c)

	var user models.User
	result := database.DB.Where("auth0_id = ?", auth0ID).First(&user)
	if result.Error != nil {
		user = models.User{Auth0ID: auth0ID, Email: email}
		if err := database.DB.Create(&user).Error; err != nil {
			return models.User{}, err
		}
	} else if email != "" && user.Email != email {
		database.DB.Model(&user).UpdateColumn("email", email)
		user.Email = email
	}
	return user, nil
}

func SyncUserHandler(c *gin.Context) {
	user, err := EnsureUser(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Nie udało się stworzyć użytkownika"})
		return
	}
	c.JSON(http.StatusOK, user)
}
