package auth

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type rateLimiter struct {
	mu      sync.Mutex
	entries map[string]*rlEntry
}

type rlEntry struct {
	count     int
	windowEnd time.Time
}

func newRateLimiter() *rateLimiter {
	rl := &rateLimiter{entries: make(map[string]*rlEntry)}
	go func() {
		for range time.Tick(time.Minute) {
			rl.purge()
		}
	}()
	return rl
}

func (rl *rateLimiter) allow(key string, limit int, window time.Duration) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()
	now := time.Now()
	e, ok := rl.entries[key]
	if !ok || now.After(e.windowEnd) {
		rl.entries[key] = &rlEntry{count: 1, windowEnd: now.Add(window)}
		return true
	}
	e.count++
	return e.count <= limit
}

func (rl *rateLimiter) purge() {
	rl.mu.Lock()
	defer rl.mu.Unlock()
	now := time.Now()
	for k, e := range rl.entries {
		if now.After(e.windowEnd) {
			delete(rl.entries, k)
		}
	}
}

var (
	otpStartIPLimiter     = newRateLimiter() // 5 req/min per IP
	otpVerifyIPLimiter    = newRateLimiter() // 10 req/min per IP
	otpVerifyEmailLimiter = newRateLimiter() // 5 req/min per email
)

func tooManyRequests(c *gin.Context) {
	c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{"error": "Too many requests, please wait"})
}
