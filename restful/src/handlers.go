package main

import (
	"fmt"
	"net/http"
	"time"
)

// res = [
// 	1: [{}, {}, {}],
// 	2: [{}, {}, {}],
// 	3: []
// ]

// TEST: curl -d "zone=1&startTime=10&endTime=20&temperature=29&moisture=233&light=110" localhost:8080/api/historic/upload
func uploadHistoricData(writer http.ResponseWriter, request *http.Request) {
	// Get data from request
	request.ParseForm()
	zone := toInt(request.Form.Get("zone"))
	startTime := toFloat(request.Form.Get("startTime"))
	endTime := toFloat(request.Form.Get("endTime"))
	temperature := toInt(request.Form.Get("temperature"))
	moisture := toInt(request.Form.Get("moisture"))
	light := toInt(request.Form.Get("light"))

	// Insert values into db
	statement, err := database.Prepare("INSERT INTO historic (zone, startTime, endTime, temperature, moisture, light) VALUES (?, ?, ?, ?, ?, ?)")
	if err != nil {
		panic(err)
	}
	statement.Exec(zone, startTime, endTime, temperature, moisture, light)

	res := Message{"Success"}
	sendResponse(res, writer)
	printRequest(request)
}

// TEST: curl localhost:8080/api/historic/
func getHistoricData(writer http.ResponseWriter, request *http.Request) {
	// Get parameters from request
	from := request.URL.Query()["from"][0]
	to := request.URL.Query()["to"][0]

	// Fetch from the db
	rows, err := database.Query("SELECT * FROM historic WHERE startTime >= " + from + " AND endTime <= " + to + " ORDER BY startTime ASC")
	if err != nil {
		panic(err)
	}

	var startTime, endTime float64
	var zone, temperature, moisture, light int
	for rows.Next() {
		rows.Scan(&zone, &startTime, &endTime, &temperature, &moisture, &light)
		fmt.Println(zone, startTime, endTime, temperature, moisture, light)
	}

	printRequest(request)
}

func uploadLiveData(writer http.ResponseWriter, request *http.Request) {
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

	res := Message{"Success"}
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
