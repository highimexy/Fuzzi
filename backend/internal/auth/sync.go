package auth

import (
	"context"
	"net/http"

	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-gonic/gin"
	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
)

type CustomClaims struct {
	Email string `json:"email"`
	validator.CustomClaims
}

// Implementujemy metodę Validate (wymóg interfejsu validatora)
func (c *CustomClaims) Validate(ctx context.Context) error {
	return nil
}

func SyncUserHandler(c *gin.Context) {
	// 1. Pobieramy claimsy z Middleware
	tokenClaims := c.MustGet("user_claims").(*validator.ValidatedClaims)

	// 2. Rzutujemy customowe dane (email)
	customClaims := tokenClaims.CustomClaims.(*CustomClaims)

	auth0ID := tokenClaims.RegisteredClaims.Subject
	userEmail := customClaims.Email

	var user models.User
	result := database.DB.Where("auth0_id = ?", auth0ID).First(&user)

	if result.Error != nil {
		user = models.User{
			Auth0ID: auth0ID,
			Email:   userEmail,
		}
		if err := database.DB.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Nie udało się stworzyć użytkownika"})
			return
		}
	}

	c.JSON(http.StatusOK, user)
}
