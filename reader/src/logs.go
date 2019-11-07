package main

import (
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"strings"
	"time"
)

func createLogFile() (path string, f *os.File) {
	t := time.Now().Unix()
	logPath := "../logs/log-" + strconv.FormatInt(t, 10) + ".txt"

	file, err := os.Create(logPath)
	if err != nil {
		log.Println(err)
		return
	}
	log.Printf("New log file created in %s\n\n", logPath)

	defer file.Close()
	return logPath, file
}

func logRawData(data, path string, file *os.File) {
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

func getLatestLog() (p string) {
	files, err := ioutil.ReadDir("../logs/")
	if err != nil {
		panic(err)
	}

	path := ""
	latestTime := 0
	for _, f := range files {
		// Safety net in case something else ends up in /log dir
		if strings.Contains(f.Name(), "log") == false {
			continue
		}

		// Find the latest log by timestamp
		name := strings.Split(f.Name(), "-")[1]
		name = strings.Split(name, ".")[0]
		nameInt, _ := strconv.Atoi(name)
		if nameInt > latestTime {
			path = f.Name()
			latestTime = nameInt
		}
	}

	return path
}

func getDataAsString(path string) (d string) {
	data, err := ioutil.ReadFile("../logs/" + path)
	if err != nil {
		panic(err)
	}
	return string(data)
}
