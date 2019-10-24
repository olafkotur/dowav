package main

import (
	"io/ioutil"
	"log"
	"strconv"
	"strings"
	"time"
)

func startProcessingData(interval time.Duration) {
	// DANGER: TESTING DATA ONLY
	endTime := time.Now().Unix()
	data := getDataAsString("../test-data.txt")
	filtered := filterDataInRange(data, 1571671395, endTime)

	// // Range of time where data should be read
	// endTime := time.Now().Unix()
	startTime := endTime - int64(interval.Seconds())

	// path := getLatestLog()
	// data := getDataAsString(path)
	// filtered := filterDataInRange(data, startTime, endTime)

	if len(filtered) != 0 {
		average := calcAverage(filtered)
		min := calcMin(filtered)
		max := calcMax(filtered)

		// fmt.Printf("Average: %d\n", average)
		// fmt.Printf("Min: %d\n", min)
		// fmt.Printf("Max: %d\n\n", max)
		formatData(average, min, max, int(startTime), int(endTime))
	} else {
		log.Printf("Skipping processing, no data to process\n\n")
	}
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
	temp, moist, light := 0, 0, 0
	for _, d := range data {
		values := strings.Split(d, " ")
		temp += toInt(values[2])
		moist += toInt(values[3])
		light += toInt(values[4])
	}

	var average []int
	total := len(data)
	average = append(average, temp/total)
	average = append(average, moist/total)
	average = append(average, light/total)

	return average
}

func calcMin(data []string) (m []int) {
	minTemp, minMoist, minLight := 10000, 10000, 10000 // Hacky - needs to change
	for _, d := range data {
		values := strings.Split(d, " ")
		temp := toInt(values[2])
		moist := toInt(values[3])
		light := toInt(values[4])

		if temp < minTemp {
			minTemp = temp
		}
		if moist < minMoist {
			minMoist = moist
		}
		if light < minLight {
			minLight = light
		}
	}

	var min []int
	min = append(min, minTemp)
	min = append(min, minMoist)
	min = append(min, minLight)

	return min
}

func calcMax(data []string) (m []int) {
	var maxTemp, maxMoist, maxLight int
	for _, d := range data {
		values := strings.Split(d, " ")
		temp := toInt(values[2])
		moist := toInt(values[3])
		light := toInt(values[4])

		if temp > maxTemp {
			maxTemp = temp
		}
		if moist > maxMoist {
			maxMoist = moist
		}
		if light > maxLight {
			maxLight = light
		}
	}

	var max []int
	max = append(max, maxTemp)
	max = append(max, maxMoist)
	max = append(max, maxLight)

	return max
}

func formatData(avg, min, max []int, startTime, endTime int) {
	type Calculations struct {
		average int `json:"average"`
		minimum int `json:"minimum"`
		maximum int `json:"maximum"`
	}

	type Data struct {
		startTime   int          `json:"startTime"`
		endTime     int          `json:"endTime"`
		temperature Calculations `json:"temperature"`
		moisture    Calculations `json:"moisture"`
		light       Calculations `json:"light"`
	}

	data := Data{
		startTime,
		endTime,
		Calculations{avg[0], min[0], max[0]},
		Calculations{avg[1], min[1], max[1]},
		Calculations{avg[2], min[2], max[2]},
	}

	// TODO: Upload to db here
	log.Println(data)
}
