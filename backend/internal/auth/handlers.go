package auth

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

func isSecureCookie() bool {
	return os.Getenv("GIN_MODE") == "release"
}

func setRefreshCookie(c *gin.Context, refreshToken string) {
	c.SetCookie(
		"refresh_token",
		refreshToken,
		60*60*24*30, // 30 days
		"/api/v1/auth",
		"",
		isSecureCookie(),
		true, // httpOnly
	)
}

// StartOTPHandler sends a request to Auth0 to email the OTP code
func StartOTPHandler(c *gin.Context) {
	if !otpStartIPLimiter.allow(c.ClientIP(), 5, time.Minute) {
		tooManyRequests(c)
		return
	}

	var req struct {
		Email string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
		return
	}

	auth0Domain := os.Getenv("AUTH0_DOMAIN")
	clientID := os.Getenv("AUTH0_CLIENT_ID")
	clientSecret := os.Getenv("AUTH0_CLIENT_SECRET")

	payload := map[string]interface{}{
		"client_id":     clientID,
		"client_secret": clientSecret,
		"connection":    "email",
		"email":         req.Email,
		"send":          "code",
	}

	jsonData, _ := json.Marshal(payload)
	resp, err := http.Post(
		fmt.Sprintf("https://%s/passwordless/start", auth0Domain),
		"application/json",
		bytes.NewBuffer(jsonData),
	)

	if err != nil || resp.StatusCode >= 400 {
		var errorBody map[string]interface{}
		if resp != nil {
			json.NewDecoder(resp.Body).Decode(&errorBody)
			fmt.Printf("[AUTH0 START ERROR] Status: %d, Response: %v\n", resp.StatusCode, errorBody)
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send OTP code"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Verification code sent to your email"})
}

// GoogleCallbackHandler exchanges an authorization code (PKCE) for an access token.
// The client_secret stays server-side; the frontend never sees it.
func GoogleCallbackHandler(c *gin.Context) {
	var req struct {
		Code         string `json:"code" binding:"required"`
		CodeVerifier string `json:"code_verifier" binding:"required"`
		RedirectURI  string `json:"redirect_uri" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code, code_verifier and redirect_uri are required"})
		return
	}

	auth0Domain := os.Getenv("AUTH0_DOMAIN")
	clientID := os.Getenv("AUTH0_CLIENT_ID")
	clientSecret := os.Getenv("AUTH0_CLIENT_SECRET")
	audience := os.Getenv("AUTH0_AUDIENCE")

	payload := map[string]interface{}{
		"grant_type":    "authorization_code",
		"client_id":     clientID,
		"client_secret": clientSecret,
		"code":          req.Code,
		"code_verifier": req.CodeVerifier,
		"redirect_uri":  req.RedirectURI,
		"audience":      audience,
	}

	jsonData, _ := json.Marshal(payload)
	resp, err := http.Post(
		fmt.Sprintf("https://%s/oauth/token", auth0Domain),
		"application/json",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to authorization server"})
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)

	if resp.StatusCode >= 400 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to exchange authorization code"})
		return
	}

	if rt, ok := result["refresh_token"].(string); ok && rt != "" {
		setRefreshCookie(c, rt)
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": result["access_token"],
		"expires_in":   result["expires_in"],
	})
}

// VerifyOTPHandler exchanges the user's OTP code for a JWT token
func VerifyOTPHandler(c *gin.Context) {
	if !otpVerifyIPLimiter.allow(c.ClientIP(), 10, time.Minute) {
		tooManyRequests(c)
		return
	}

	var req struct {
		Email string `json:"email" binding:"required,email"`
		Code  string `json:"code" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email and code are required"})
		return
	}

	if !otpVerifyEmailLimiter.allow(req.Email, 5, time.Minute) {
		tooManyRequests(c)
		return
	}

	auth0Domain := os.Getenv("AUTH0_DOMAIN")
	clientID := os.Getenv("AUTH0_CLIENT_ID")
	clientSecret := os.Getenv("AUTH0_CLIENT_SECRET")
	audience := os.Getenv("AUTH0_AUDIENCE")

	payload := map[string]interface{}{
		"grant_type":    "http://auth0.com/oauth/grant-type/passwordless/otp",
		"client_id":     clientID,
		"client_secret": clientSecret,
		"username":      req.Email,
		"otp":           req.Code,
		"realm":         "email",
		"audience":      audience,
		"scope":         "openid profile email offline_access",
	}

	jsonData, _ := json.Marshal(payload)
	resp, err := http.Post(
		fmt.Sprintf("https://%s/oauth/token", auth0Domain),
		"application/json",
		bytes.NewBuffer(jsonData),
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to authorization server"})
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)

	if resp.StatusCode >= 400 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid code or email"})
		return
	}

	if rt, ok := result["refresh_token"].(string); ok && rt != "" {
		setRefreshCookie(c, rt)
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": result["access_token"],
		"expires_in":   result["expires_in"],
	})
}

// RefreshHandler reads the refresh_token cookie and exchanges it for a new access token.
func RefreshHandler(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil || refreshToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No refresh token"})
		return
	}

	auth0Domain := os.Getenv("AUTH0_DOMAIN")
	clientID := os.Getenv("AUTH0_CLIENT_ID")
	clientSecret := os.Getenv("AUTH0_CLIENT_SECRET")

	payload := map[string]interface{}{
		"grant_type":    "refresh_token",
		"client_id":     clientID,
		"client_secret": clientSecret,
		"refresh_token": refreshToken,
	}

	jsonData, _ := json.Marshal(payload)
	resp, err := http.Post(
		fmt.Sprintf("https://%s/oauth/token", auth0Domain),
		"application/json",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to refresh token"})
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)

	if resp.StatusCode >= 400 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired refresh token"})
		return
	}

	// Auth0 may issue a new refresh token when rotation is enabled
	if rt, ok := result["refresh_token"].(string); ok && rt != "" {
		setRefreshCookie(c, rt)
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": result["access_token"],
		"expires_in":   result["expires_in"],
	})
}

// LogoutHandler clears the refresh_token cookie.
func LogoutHandler(c *gin.Context) {
	c.SetCookie("refresh_token", "", -1, "/api/v1/auth", "", isSecureCookie(), true)
	c.JSON(http.StatusOK, gin.H{"logged_out": true})
}
