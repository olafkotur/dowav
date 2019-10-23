package main

import (
	"log"
	"time"
	"os"

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
	//SERIAL_PORT_NAME := os.Getenv("SERIAL_PORT_NAME")
	//SERIAL_PORT_BAUD := os.Getenv("SERIAL_PORT_BAUD")

	// Execution start
	go startServer(WEB_BUILD_PATH, SERVER_PORT)
	//go readSerial(SERIAL_PORT_NAME, SERIAL_PORT_BAUD)

	refreshRate := 1 * time.Second
	processInterval := 1 * time.Hour
	timeSinceLastRun := 1 * time.Hour
	for {
		if timeSinceLastRun >= processInterval {
			timeSinceLastRun = 0 * time.Second
			startProcessingData(processInterval)
		} else {
			timeSinceLastRun += 1 * time.Second
		}
		time.Sleep(refreshRate)
	}
}
