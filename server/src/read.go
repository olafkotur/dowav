package main

import (
	"bufio"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

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

	path, file := createLogFile()
	go listenAndLogR(sp, path, file)
}

func listenAndLogR(sp *serial.Port, path string, file *os.File) func() {
	reader := bufio.NewReader(sp)
	bytes, _ := reader.ReadBytes('\x0a')
	if bytes != nil {
		str := string(bytes)
		logData(str, path, file)
	}
	return listenAndLogR(sp, path, file)
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

func formatData(data string) (values []string) {
	return strings.Split(data, " ")
}
