package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

func startProcessingData(interval time.Duration) {
	// DANGER: TESTING DATA ONLY
	// endTime := time.Now().Unix()
	// startTime := endTime - int64(interval.Seconds())
	// data := getDataAsString("test-data.txt")
	// filtered := filterDataInRange(data, 1573133958, endTime)

	// Range of time where data should be read
	endTime := time.Now().Unix()
	startTime := endTime - int64(interval.Seconds())

	path := getLatestLog()
	data := getDataAsString(path)
	filtered := filterDataInRange(data, startTime, endTime)

	if len(filtered) <= 0 {
		log.Printf("Skipping processing, no data to process\n\n")
		return
	}

	// Calculate and send each zone independently
	zones := splitByZone(filtered)
	for i, zone := range zones {
		if len(zone) <= 0 {
			continue
		}

		fmt.Println("Uploading data for zone: ", i+1)
		average := calcAverage(zone)
		min := calcMin(zone)
		max := calcMax(zone)
		formatted := formatHistoricData(average, min, max, int(startTime), int(endTime), i+1)
		uploadHistoricData(formatted)
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

func formatHistoricData(avg, min, max []int, startTime, endTime, zone int) []byte {
	data := HistoricData{
		zone,
		startTime,
		endTime,
		Calculations{avg[0], min[0], max[0]},
		Calculations{avg[1], min[1], max[1]},
		Calculations{avg[2], min[2], max[2]},
	}

	res, _ := json.Marshal(data)
	return res
}

func formatLiveData(d string) (r []byte) {
	zone := toInt(d[1:2])
	split := strings.Split(d, " ")
	t := toInt(split[1])
	m := toInt(split[2])
	l := toInt(strings.Replace(split[3], "\r\n", "", 1))

	now := time.Now().Unix()
	data := Readings{
		zone,
		Data{now, t},
		Data{now, m},
		Data{now, l},
	}
	res, _ := json.Marshal(data)
	return res
}

// Splits the data based on the zone, returns 2D array of zones and data
func splitByZone(data []string) (z [3][]string) {
	var zones [3][]string
	for _, d := range data {
		zone := strings.Split(d, " ")[1][1:2]
		index := toInt(zone) - 1
		zones[index] = append(zones[index], d)
	}
	return zones
}

// Uploads the live data via the rest api
func uploadLiveData(data []byte) {
	obj := Readings{}
	json.Unmarshal(data, &obj)

	// Define the form values
	values := url.Values{
		"zone":        {toString(obj.Zone)},
		"temperature": {toString(obj.Temperature.Value)},
		"moisture":    {toString(obj.Moisture.Value)},
		"light":       {toString(obj.Light.Value)},
	}
	_, err := http.PostForm("http://dowav-api.herokuapp.com/api/live/upload", values)
	if err != nil {
		return
	}
}

// Uploads the historic data via the rest api
func uploadHistoricData(data []byte) {
	obj := HistoricData{}
	json.Unmarshal(data, &obj)

	// Define the form values
	values := url.Values{
		"zone":        {toString(obj.Zone)},
		"startTime":   {toString(obj.StartTime)},
		"endTime":     {toString(obj.EndTime)},
		"temperature": {toString(obj.Temperature.Average)},
		"moisture":    {toString(obj.Moisture.Average)},
		"light":       {toString(obj.Light.Average)},
	}
	_, err := http.PostForm("http://dowav-api.herokuapp.com/api/historic/upload", values)
	if err != nil {
		return
	}
}
