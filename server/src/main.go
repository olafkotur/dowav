package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	var err = godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
		log.Fatal("Error loading .env file")
	}

	// Enviornment variables
	SERVER_PORT := os.Getenv("SERVER_PORT")
	WEB_BUILD_PATH := os.Getenv("WEB_BUILD_PATH")

	go startServer(SERVER_PORT, WEB_BUILD_PATH)
}

func startServer(port, path string) {
	var fs = http.FileServer(http.Dir(path))
	http.Handle("/", fs)

	log.Printf("Listening on %s...\n\n", port)
	http.ListenAndServe(":"+port, nil)
}
