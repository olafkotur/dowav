package main

import (
	"bufio"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"github.com/tarm/serial"
)

func main() {
	var err = godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Enviornment variables
	SERIAL_PORT_NAME := os.Getenv("SERIAL_PORT_NAME")
	SERIAL_PORT_BAUD := os.Getenv("SERIAL_PORT_BAUD")

	go startReadingSerial(SERIAL_PORT_NAME, SERIAL_PORT_BAUD)
	startScheduler()
}

func startReadingSerial(name, baud string) {
	log.Printf("Attempting to read serial data\n")
	baudInt, err := strconv.Atoi(baud)
	if err != nil {
		log.Println(err)
		return
	}

	config := &serial.Config{Name: name, Baud: baudInt}
	sp, err := serial.OpenPort(config)
	if err != nil {
		log.Println(err)
		return
	}
	log.Printf("Success - listening to %s\n\n", name)

	path, file := createLogFile()
	for {
		data := listenToPort(sp)
		// TOOD: RAW DATA
		logRawData(data, path, file)

		formatted := formatLiveData(data)
		uploadLiveData(formatted)
	}
}

func listenToPort(sp *serial.Port) (b string) {
	var data string
	reader := bufio.NewReader(sp)
	bytes, _ := reader.ReadBytes('\x0a')
	if bytes != nil {
		data = string(bytes)
	}
	return data
}

func toInt(s string) (i int) {
	r, err := strconv.Atoi(s)
	if err != nil {
		panic(err)
	}
	return r
}

func toString(i int) (s string) {
	return strconv.Itoa(i)
}
