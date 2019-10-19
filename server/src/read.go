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
	path, file := createLogFile()

	log.Printf("Attempting to read serial data\n")
	baudInt, err := strconv.Atoi(baud)
	if err != nil {
		panic(err)
	}

	conf := &serial.Config{Name: name, Baud: baudInt}
	sp, err := serial.OpenPort(conf)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Success - listening to %s\n\n", name)
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
	t := time.Now()
	logPath := "logs/log-" + t.Format("020106-150405") + ".txt"

	file, err := os.Create(logPath)
	if err != nil {
		log.Fatal(err, file)
	}
	log.Printf("New log file created in %s\n\n", logPath)

	defer file.Close()
	return logPath, file
}

func logData(data, path string, file *os.File) {
	existingData, err := ioutil.ReadFile(path)
	if err != nil {
		panic(err)
	}

	t := time.Now()
	writeBytes := append(existingData, []byte(t.Format("01 January 2006 15:04:05")+" "+data)...)
	err = ioutil.WriteFile(path, writeBytes, 0644)
	if err != nil {
		panic(err)
	}
}

func formatData(data string) (values []string) {
	return strings.Split(data, " ")
}
