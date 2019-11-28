package main

import (
	"errors"
	"net/http"
	"regexp"
	"strconv"
)

func getMessageTweet(msg string) (string, error, int) {
	match, _ := regexp.MatchString("temperature", msg)
	if match {
		result, error, int := getLiveDataBySensor("temperature", "°C ")
		if error != nil {
			return "", error, int
		}
		return "Q: " + msg + "\n\nA: " + result + "\n\n#temperature", nil, 0
	}

	match1, _ := regexp.MatchString("(humidity)|(moisture)", msg)
	if match1 {
		result, error, int := getLiveDataBySensor("moisture", " ")
		if error != nil {
			return "", error, int
		}
		return "Q: " + msg + "\n\nA: " + result + "\n\n#humidity", nil, 0
	}

	match2, _ := regexp.MatchString("light", msg)
	if match2 {
		result, error, int := getLiveDataBySensor("light", " ")
		if error != nil {
			return "", error, int
		}
		return "Q: " + msg + "\n\nA: " + result + "\n\n#light", nil, 0
	}

	return "", errors.New("Invalid input"), http.StatusBadRequest

}

func getLiveDataBySensor(sensor string, symbol string) (string, error, int) {
	var res []ReadingData
	for i := 0; i < 3; i++ {
		// Get data from db
		var time float64
		var sensorValue float64
		rows, err := database.Query("SELECT time, " + sensor + " FROM live WHERE zoneId == " + toString(i+1) + " ORDER BY time DESC LIMIT 1")
		if err != nil {
			return "", errors.New("Database read error occured."), http.StatusInternalServerError
		}

		for rows.Next() {
			_ = rows.Scan(&time, &sensorValue)
		}
		rows.Close()

		// Format data
		data := ReadingData{time * 1000, sensorValue}
		res = append(res, data)
	}

	var str = ""
	for i, v := range res {
		if v.Value != 0 {
			str = str + "Zone " + strconv.Itoa(i+1) + " - " + strconv.FormatFloat(v.Value, 'f', -1, 64) + symbol
		}
	}

	if str == "" {
		str = "No data available."
	}

	return str, nil, 0
}
