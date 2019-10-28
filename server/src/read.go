package main

import (
	"bufio"
	"log"
	"strconv"

	"github.com/tarm/serial"
)

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
		if data != "" {
			logData(data, path, file)
		}
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
