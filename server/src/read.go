package main

import (
	"bufio"
	"log"
	"strconv"

	"github.com/tarm/serial"
)

func startReadingSerial(name, baud string, channels []chan string) {
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
		strData := string(data[1])

		if data == "" {
			continue
		} else {
			// Send via goutine channels
			if strData == "1" {
				clearChan(channels[0])
				channels[0] <- data

			} else if strData == "2" {
				clearChan(channels[1])
				channels[1] <- data

			} else if strData == "3" {
				clearChan(channels[2])
				channels[2] <- data
			}

			logData(data, path, file)
		}

	}
}

// Deletes unused messgaes
func clearChan(c chan string) {
	for len(c) > 0 {
		<-c
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
