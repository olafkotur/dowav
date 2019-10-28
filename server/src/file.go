package main

import (
	"io/ioutil"
	"strconv"
	"strings"
)

func getLatestLog() (p string) {
	files, err := ioutil.ReadDir("./logs/")
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
	data, err := ioutil.ReadFile("logs/" + path)
	if err != nil {
		panic(err)
	}
	return string(data)
}
