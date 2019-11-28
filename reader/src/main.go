package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
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

	setDefaultSettings()

	go startReadingSerial(SERIAL_PORT_NAME, SERIAL_PORT_BAUD)
	go listenUserSettings()
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

	path := createLogFile()
	for {
		data := listenToPort(sp)

		if len(data) <= 0 {
			log.Println("Unexpected data format read from serial port, skipping")
			continue
		}

		// Check which handler should be used
		if data[:1] == "R" {
			logRawData(data, path)
			handleEnvironment(data)
		} else if data[:1] == "L" {
			handleLocation(data)
		} else if data[:1] == "W" {
			handleWater(data)
		} else {
			log.Println("Unexpected data format read from serial port, skipping")
		}
	}
}

func setDefaultSettings() {
	res, err := http.Get("http://dowav-api.herokuapp.com/api/setting/all")
	if err != nil {
		log.Println("Failed to set default user settings")
	}
	defer res.Body.Close()

	var settings []Setting
	body, _ := ioutil.ReadAll(res.Body)
	_ = json.Unmarshal(body, &settings)

	for _, s := range settings {
		switch s.Type {
		case "minTemperature":
			minTemperature = toInt(s.Value)
		case "minMoisture":
			minMoisture = toInt(s.Value)
		case "minLight":
			minLight = toInt(s.Value)
		case "maxTemperature":
			maxTemperature = toInt(s.Value)
		case "maxLight":
			maxLight = toInt(s.Value)
		case "shouldSendTweets":
			shouldSendTweets = s.Value == "true"
		}
	}

	fmt.Println("Set default user settings to:", minTemperature, minMoisture, minLight, maxTemperature, maxLight, shouldSendTweets)
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
		log.Println(err)
	}
	return r
}

func toString(i int) (s string) {
	return strconv.Itoa(i)
}

func toFloat(s string) (f float64) {
	res, _ := strconv.ParseFloat(s, 64)
	return res
}
