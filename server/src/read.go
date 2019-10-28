package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
	"github.com/tarm/serial"
)

func readSerial(name, baud string) {
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

	go sendSocketData(sp)

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

func createLogFile() (path string, f *os.File) {
	t := time.Now().Unix()
	logPath := "logs/log-" + strconv.FormatInt(t, 10) + ".txt"

	file, err := os.Create(logPath)
	if err != nil {
		log.Println(err)
		return
	}
	log.Printf("New log file created in %s\n\n", logPath)

	defer file.Close()
	return logPath, file
}

func logData(data, path string, file *os.File) {
	existingData, err := ioutil.ReadFile(path)
	if err != nil {
		log.Println(err)
		return
	}

	t := time.Now().Unix()
	writeBytes := append(existingData, []byte(strconv.FormatInt(t, 10)+" "+data)...)
	err = ioutil.WriteFile(path, writeBytes, 0644)
	if err != nil {
		log.Println(err)
		return
	}
}

func sendSocketData(sp *serial.Port) {
	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}

	fmt.Println("Establishing web socket connection on /live/data")
	http.HandleFunc("/live/data", func(writer http.ResponseWriter, request *http.Request) {
		fmt.Println("Sending data")
		conn, err := upgrader.Upgrade(writer, request, nil)
		if err != nil {
			panic(err)
		}
		for {
			data := listenToPort(sp)
			if data != "" {
				conn.WriteMessage(1, []byte(data))
			}
		}
	})
}
