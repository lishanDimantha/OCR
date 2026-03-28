package tests

import (
	"QUICK-READ-BACKEND/controllers"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestHealthCheck(t *testing.T) {
	// Set Gin to test mode
	gin.SetMode(gin.TestMode)

	// Create a test router and register the health endpoint
	router := gin.Default()
	router.GET("/health", controllers.HealthCheck)

	// Create a test HTTP request
	req, _ := http.NewRequest("GET", "/health", nil)
	w := httptest.NewRecorder()

	// Perform the request
	router.ServeHTTP(w, req)

	// Assert status code (could be 200 or 503 depending on DB state)
	assert.True(t, w.Code == http.StatusOK || w.Code == http.StatusServiceUnavailable)
}
