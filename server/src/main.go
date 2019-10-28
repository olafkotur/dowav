package main

import (
	"log"
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
	SERIAL_PORT_NAME := os.Getenv("SERIAL_PORT_NAME")
	SERIAL_PORT_BAUD := os.Getenv("SERIAL_PORT_BAUD")

	go startServer(SERVER_PORT, WEB_BUILD_PATH)
	go startReadingSerial(SERIAL_PORT_NAME, SERIAL_PORT_BAUD)
	startScheduler()
}
