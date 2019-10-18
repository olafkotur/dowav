package main

import (
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/argandas/serial"
	"github.com/joho/godotenv"
)

func main() {
	var err = godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	SERVER_PORT := os.Getenv("SERVER_PORT")
	WEB_BUILD_PATH := os.Getenv("WEB_BUILD_PATH")
	SERIAL_PORT_NAME := os.Getenv("SERIAL_PORT_NAME")
	SERIAL_PORT_BAUD := os.Getenv("SERIAL_PORT_BAUD")

	startServer(WEB_BUILD_PATH, SERVER_PORT)
	readSerial(SERIAL_PORT_NAME, SERIAL_PORT_BAUD)
}

func startServer(path, port string) {
	var fs = http.FileServer(http.Dir(path))
	http.Handle("/", fs)

	log.Println("Listening on " + port + "...")
	go http.ListenAndServe(":"+port, nil)
}

func readSerial(name, baud string) {
	var baudInt, err = strconv.Atoi(baud)
	if err != nil {
		panic(err)
	}

	var sp = serial.New()
	err = sp.Open(name, baudInt)
	if err != nil {
		panic(err)
	}

	for {
		sp.Read()
	}
}
