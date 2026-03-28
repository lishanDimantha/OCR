package main

import (
	"QUICK-READ-BACKEND/Routes"
	"QUICK-READ-BACKEND/config"
	"QUICK-READ-BACKEND/controllers"
	"QUICK-READ-BACKEND/models"
	"QUICK-READ-BACKEND/services"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Initialize Logger
	config.InitLogger()

	// 2. Connect to Database (Render PostgreSQL / AWS RDS)
	config.ConnectDB()

	// AutoMigrate all models - අලුත් Database එකේ tables සෑදීම මෙහිදී සිදුවේ
	err := config.DB.AutoMigrate(
		&models.User{},
		&models.Prescription{},
		&models.Medicine{},
		&models.Order{},
		&models.Cart{},
		&models.CartItem{},
		&models.DeliveryDriver{},
		&models.DeliveryHistory{},
		&models.Route{},
		&models.Notification{},
	)
	if err != nil {
		log.Fatalf("❌ Failed to migrate database models: %v", err)
	}

	// Ensure uploads directory exists
	if _, err := os.Stat("uploads"); os.IsNotExist(err) {
		os.Mkdir("uploads", 0755)
	}

	// 3. Initialize Redis Cache (Render හි Redis ඇත්නම් පමණක්)
	config.ConnectRedis()

	// 4. Initialize Event Bus (for async processing)
	services.InitEventBus()

	// 5. Initialize WebSocket Hub
	controllers.InitWebSocketHub()

	// 6. Setup Router
	r := gin.Default()

	// CORS Configuration - Frontend එකට සම්බන්ධ වීමට ඉඩ ලබා දීම
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// --- HEALTH CHECK ENDPOINT ---
	// Render එකට සහ ඔබට සර්වර් එකේ තත්ත්වය බැලීමට මෙය උදවු වේ
	r.GET("/health", func(c *gin.Context) {
		sqlDB, err := config.DB.DB()
		dbStatus := "OK"
		if err != nil || sqlDB.Ping() != nil {
			dbStatus = "Disconnected"
		}

		c.JSON(http.StatusOK, gin.H{
			"status":   "UP",
			"database": dbStatus,
			"message":  "Quick-Read API is live on Render",
		})
	})

	// Setup all routes from Routes package
	Routes.SetupRouter(r)

	// Serve uploads directory statically
	r.Static("/uploads", "./uploads")

	// 7. Start Server
	// Render සාමාන්‍යයෙන් PORT environment variable එකක් ලබා දෙයි.
	// එය නැතිනම් default ලෙස 8080 භාවිතා කරයි.
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Starting Quick-Read API on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("❌ Failed to start server: %v", err)
	}
}
