package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/tarm/serial"
)

func readSerial(name, baud string) {
	fmt.Println("\nAttempting to read serial data")
	baudInt, err := strconv.Atoi(baud)
	if err != nil {
		panic(err)
	}

	conf := &serial.Config{Name: name, Baud: baudInt}
	sp, err := serial.OpenPort(conf)
	if err != nil {
		log.Fatal(err)
	}

	file, err := os.Create("logs/log.txt")
	if err != nil {
		log.Fatal(err, file)
	}
	fmt.Println("New log file created in ./logs/log.txt")

	defer file.Close()

	for {
		reader := bufio.NewReader(sp)
		bytes, _ := reader.ReadBytes('\x0a')
		if bytes != nil {
			str := string(bytes)
			formatted := formatData(str)
			logData(str, formatted, file)
		}
	}
}

func formatData(data string) (values []string) {
	return strings.Split(data, " ")
}

func logData(data string, formattedData []string, file *os.File) {
	existingData, err := ioutil.ReadFile("logs/log.txt")
	if err != nil {
		panic(err)
	}

	t := time.Now()
	writeBytes := append(existingData, []byte(t.Format("01 January 2006 15:04:05")+" "+data)...)
	err = ioutil.WriteFile("logs/log.txt", writeBytes, 0644)
	if err != nil {
		panic(err)
	}
}
