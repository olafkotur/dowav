package main

import (
	"encoding/json"
	"fmt"
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

		// TODO: Upload to db here
		res := formatProcessedData(average, min, max, int(startTime), int(endTime))
		fmt.Println(string(res))
	} else {
		log.Printf("Skipping processing, no data to process\n\n")
	}
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

func formatProcessedData(avg, min, max []int, startTime, endTime int) []byte {
	type Calculations struct {
		Average int `json:"average"`
		Minimum int `json:"minimum"`
		Maximum int `json:"maximum"`
	}

	type Data struct {
		StartTime   int          `json:"startTime"`
		EndTime     int          `json:"endTime"`
		Temperature Calculations `json:"temperature"`
		Moisture    Calculations `json:"moisture"`
		Light       Calculations `json:"light"`
	}

	data := Data{
		startTime,
		endTime,
		Calculations{avg[0], min[0], max[0]},
		Calculations{avg[1], min[1], max[1]},
		Calculations{avg[2], min[2], max[2]},
	}

	res, _ := json.Marshal(data)
	return res
}

func formatSocketData(d string) (r []byte) {
	split := strings.Split(d, " ")
	t := toInt(split[1])
	m := toInt(split[2])
	l := toInt(strings.Replace(split[3], "\r\n", "", 1))

	type Data struct {
		Time  int64 `json:"time"`
		Value int   `json:"value"`
	}

	type Readings struct {
		Temperature Data `json:"temp"`
		Moisture    Data `json:"moisture"`
		Light       Data `json:"light"`
	}

	now := time.Now().Unix()
	data := Readings{
		Data{now, t},
		Data{now, m},
		Data{now, l},
	}
	res, _ := json.Marshal(data)
	return res
}

func toInt(s string) (i int) {
	r, err := strconv.Atoi(s)
	if err != nil {
		panic(err)
	}
	return r
}

func toString(i int) (s string) {
	return strconv.Itoa(i)
}
