package main

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

func main() {
	var err = godotenv.Load()
	if err != nil {
		log.Fatal(err)
		log.Fatal("Error loading .env file")
	}

	// Enviornment variables
	SERVER_PORT := os.Getenv("SERVER_PORT")
	WEB_BUILD_PATH := os.Getenv("WEB_BUILD_PATH")
	SERIAL_PORT_NAME := os.Getenv("SERIAL_PORT_NAME")
	SERIAL_PORT_BAUD := os.Getenv("SERIAL_PORT_BAUD")

	// Execution start
	go startServer(WEB_BUILD_PATH, SERVER_PORT)
	go readSerial(SERIAL_PORT_NAME, SERIAL_PORT_BAUD)

	refreshRate := 1 * time.Second
	processInterval := 15 * time.Second
	timeSinceLastRun := 0 * time.Second
	for {
		time.Sleep(refreshRate)
		if timeSinceLastRun >= processInterval {
			timeSinceLastRun = 0 * time.Second
			go startProcessingData()
		} else {
			timeSinceLastRun += 1 * time.Second
		}
	}
}
