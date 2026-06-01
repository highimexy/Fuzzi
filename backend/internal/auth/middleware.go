package auth

import (
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/auth0/go-jwt-middleware/v2/jwks"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-gonic/gin"
)

// OptionalToken sets user_claims if a valid token is present, but never rejects the request.
func OptionalToken() gin.HandlerFunc {
	issuerURL, _ := url.Parse("https://" + os.Getenv("AUTH0_DOMAIN") + "/")
	audience := os.Getenv("AUTH0_AUDIENCE")
	provider := jwks.NewCachingProvider(issuerURL, 5*time.Minute)
	jwtValidator, _ := validator.New(
		provider.KeyFunc,
		validator.RS256,
		issuerURL.String(),
		[]string{audience},
		validator.WithCustomClaims(func() validator.CustomClaims { return &CustomClaims{} }),
	)

	return func(c *gin.Context) {
		if authHeader := c.GetHeader("Authorization"); authHeader != "" {
			tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
			if claims, err := jwtValidator.ValidateToken(c.Request.Context(), tokenString); err == nil {
				c.Set("user_claims", claims.(*validator.ValidatedClaims))
			}
		}
		c.Next()
	}
}

func EnsureValidToken() gin.HandlerFunc {
	issuerURL, _ := url.Parse("https://" + os.Getenv("AUTH0_DOMAIN") + "/")
	audience := os.Getenv("AUTH0_AUDIENCE")

	provider := jwks.NewCachingProvider(issuerURL, 5*time.Minute)

	jwtValidator, _ := validator.New(
		provider.KeyFunc,
		validator.RS256,
		issuerURL.String(),
		[]string{audience},
		validator.WithCustomClaims(func() validator.CustomClaims {
			return &CustomClaims{}
		}),
	)

	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing authorization header"})
			return
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		claims, err := jwtValidator.ValidateToken(c.Request.Context(), tokenString)
		if err != nil {
			log.Printf("Invalid token: %v", err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		c.Set("user_claims", claims.(*validator.ValidatedClaims))
		c.Next()
	}
}
