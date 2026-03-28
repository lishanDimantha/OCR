package controllers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/lishanDimantha/OCR/QUICK-READ-BACKEND/config" // ඔබේ config පැකේජය මෙතැනට යොදන්න
)

func HealthCheck(c *gin.Context) {
	// 1. Database එක වැඩ කරනවාදැයි පරීක්ෂා කිරීම
	sqlDB, err := config.DB.DB()
	dbStatus := "OK"
	
	if err != nil || sqlDB.Ping() != nil {
		dbStatus = "Disconnected"
	}

	// 2. අවසාන ප්‍රතිචාරය (Response) ලබා දීම
	status := http.StatusOK
	if dbStatus != "OK" {
		status = http.StatusServiceUnavailable
	}

	c.JSON(status, gin.H{
		"status":   "UP",
		"database": dbStatus,
		"message":  "OCR Backend is running",
	})
}