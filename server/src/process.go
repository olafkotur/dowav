package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"strconv"
	"strings"
	"time"
)

func startProcessingData(interval time.Duration) {
	log.Printf("Starting to process data for the last %d minutes\n", interval/time.Minute)

	// Range of time where data should be read
	endTime := time.Now().Unix()
	startTime := endTime - int64(interval.Seconds())

	path := getLatestLog()
	data := getDataAsString(path)
	filtered := filterDataInRange(data, startTime, endTime)
	average := calcAverage(filtered)
	fmt.Println(average)
}

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
		} else {
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

func filterDataInRange(data string, start, end int64) (f []string) {
	rows := strings.Split(data, "\r\n")
	var filtered []string
	for _, r := range rows {
		time, _ := strconv.Atoi(strings.Split(r, " ")[0])
		timeInt := int64(time)
		if timeInt > start && timeInt < end {
			filtered = append(filtered, r)
		}
	}

	return filtered
}

func calcAverage(data []string) (a []int) {
	// Store sum of all values
	sumTemp, sumMoist, sumLight := 0, 0, 0
	for _, d := range data {
		values := strings.Split(d, " ")
		sumTemp += toInt(values[2])
		sumMoist += toInt(values[3])
		sumLight += toInt(values[4])
	}

	var average []int
	average = append(average, sumTemp/len(data))
	average = append(average, sumMoist/len(data))
	average = append(average, sumLight/len(data))

	return average

}

func calcMin() {

}

func calcMax() {

}