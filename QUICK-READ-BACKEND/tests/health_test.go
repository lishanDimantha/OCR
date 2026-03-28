package tests

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// මෙහි නම Test... ලෙස ආරම්භ නොවන නිසා Go මෙය වෙනම test එකක් ලෙස පටලවා ගන්නේ නැත
func mockHealthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":   "UP",
		"database": "OK",
		"message":  "Quick-Read API is live on Render",
	})
}

func TestHealthCheck(t *testing.T) {
	// 1. Setup Test Mode
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/health", mockHealthHandler)

	// 2. Create Request
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/health", nil)

	// 3. Perform Request
	router.ServeHTTP(w, req)

	// 4. Assertions
	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)

	assert.Nil(t, err)
	assert.Equal(t, "UP", response["status"])
	assert.Equal(t, "OK", response["database"])
}
