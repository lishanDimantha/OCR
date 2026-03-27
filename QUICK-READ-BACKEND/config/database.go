package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres" // mysql වෙනුවට postgres භාවිතා කරන්න
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	// .env ගොනුව තිබේ නම් පමණක් load කරයි
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	// Render Dashboard එකෙන් ලබාදෙන DATABASE_URL එක කෙලින්ම භාවිතා කිරීම
	dsn := os.Getenv("DATABASE_URL")

	// DATABASE_URL එක නොමැති නම් පමණක් පරණ ක්‍රමයට (Manual DSN) උත්සාහ කරයි
	if dsn == "" {
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
			os.Getenv("DB_HOST"),
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_NAME"),
			os.Getenv("DB_PORT"),
		)
	}

	// Postgres driver එක භාවිතා කර සම්බන්ධ වීම
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to Database:", err)
	}

	fmt.Println("Connected to PostgreSQL Database successfully!")
}