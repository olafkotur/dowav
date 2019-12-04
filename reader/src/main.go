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
	"time"

	"github.com/joho/godotenv"
	"github.com/tarm/serial"
)

var hueUserId string
var hueUrl string

func main() {
	var err = godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Enviornment variables
	SERIAL_PORT_NAME := os.Getenv("SERIAL_PORT_NAME")
	SERIAL_PORT_BAUD := os.Getenv("SERIAL_PORT_BAUD")

	setDefaultSettings()

	go attemptHueConnection()
	go startReadingSerial(SERIAL_PORT_NAME, SERIAL_PORT_BAUD)
	go listenUserSettings()
	startScheduler()
}

func attemptHueConnection() {
	ok := false
	hueUrl = "localhost:9090"
	hueUserId, ok = createHueId(hueUrl)
	if !ok {
		fmt.Println("Hue connection failed, re-attempting in 10 seconds")
		time.Sleep(10 * time.Second)
		attemptHueConnection()
	}

	// Set all lights to default
	for i := 0; i < 3; i++ {
		toggleLight(hueUserId, hueUrl, true, i+1)
		changeColor(hueUserId, hueUrl, zoneSettings[i].BulbColor, i+1)
		changeBrightness(hueUserId, hueUrl, i+1, zoneSettings[i].BulbBrightness)
	}
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
		writer := bufio.NewWriter(sp)
		msg := []byte("X Python is a hacking language")
		_, err := writer.Write(msg)
		if err != nil {
			log.Println(err)
		}

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
			fmt.Println(data)
		}
	}
}

func setDefaultSettings() {
	res, err := http.Get("http://dowav-api.herokuapp.com/api/setting/all")
	if err != nil {
		log.Println("Failed to set default user settings")
	}

	body, _ := ioutil.ReadAll(res.Body)
	var settings []ZoneSetting
	_ = json.Unmarshal(body, &settings)
	res.Body.Close()

	// Set settings only that have a zone
	for _, s := range settings {
		if s.Zone != 0 {
			zoneSettings = append(zoneSettings, s)
		}
	}
	fmt.Println("Set default user settings to:", zoneSettings)
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
