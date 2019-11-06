package main

import (
	"fmt"
	"net/http"
	"time"
)

// curl -d "zone=1&startTime=2312321&endTime=41232312&temperature=29&moisture=233&light=110" localhost:8080/api/historic/upload
func uploadHistoricData(writer http.ResponseWriter, request *http.Request) {
	// Get data from request
	request.ParseForm()
	zone := toInt(request.Form.Get("zone"))
	startTime := toFloat(request.Form.Get("startTime"))
	endTime := toFloat(request.Form.Get("endTime"))
	averageTemperature := toInt(request.Form.Get("temperature"))
	averageMoisture := toInt(request.Form.Get("moisture"))
	averageLight := toInt(request.Form.Get("light"))

	statement, err := database.Prepare("INSERT INTO historic (zone, startTime, endTime, averageTemperature, averageMoisture, averageLight) VALUES (?, ?, ?, ?, ?, ?)")
	if err != nil {
		panic(err)
	}
	statement.Exec(zone, startTime, endTime, averageTemperature, averageMoisture, averageLight)

	res := Message{"Success"}
	sendResponse(res, writer)
	printRequest(request)
}

func uploadLiveData(writer http.ResponseWriter, request *http.Request) {
	type Data struct {
		Message string `json:"message"`
	}

	// Get data from request
	request.ParseForm()
	time := time.Now().Unix()
	temperature := toInt(request.Form.Get("temperature"))
	moisture := toInt(request.Form.Get("moisture"))
	light := toInt(request.Form.Get("light"))

	statement, err := database.Prepare("INSERT INTO live (time, temperature, moisture, light) VALUES (?, ?, ?, ?)")
	if err != nil {
		panic(err)
	}
	statement.Exec(time, temperature, moisture, light)

	res := Data{"Success"}
	sendResponse(res, writer)
	printRequest(request)
}

func getLiveData(writer http.ResponseWriter, request *http.Request) {
	var time float64
	var temperature int
	var moisture int
	var light int

	// Get data from db
	rows, err := database.Query("SELECT * FROM live ORDER BY time DESC LIMIT 1")
	if err != nil {
		panic(err)
	}

	for rows.Next() {
		rows.Scan(&time, &temperature, &moisture, &light)
		fmt.Println(rows)
	}
	rows.Close()

	// Format data
	data := Readings{
		ReadingData{time, temperature},
		ReadingData{time, moisture},
		ReadingData{time, light},
	}

	sendResponse(data, writer)
	printRequest(request)
}
