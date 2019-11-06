package main

import (
	"net/http"
	"strings"
	"time"
)

// TEST: curl -d "zone=3&startTime=11&endTime=24&temperature=29&moisture=233&light=110" localhost:8080/api/historic/upload
func uploadHistoricData(writer http.ResponseWriter, request *http.Request) {
	// Get data from request
	request.ParseForm()
	zone := toInt(request.Form.Get("zone"))
	startTime := toFloat(request.Form.Get("startTime"))
	endTime := toFloat(request.Form.Get("endTime"))
	temperature := toInt(request.Form.Get("temperature"))
	moisture := toInt(request.Form.Get("moisture"))
	light := toInt(request.Form.Get("light"))

	if zone <= 0 {
		// TODO: Should send bad response
		return
	}

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
	rows, err := database.Query("SELECT * FROM historic WHERE startTime >= " + from + " AND endTime <= " + to + " ORDER BY zone ASC")
	if err != nil {
		panic(err)
	}

	var res HistoricDataRes
	var startTime, endTime float64
	var zone, temperature, moisture, light int

	// Populate response from the db into correct array positions
	for rows.Next() {
		rows.Scan(&zone, &startTime, &endTime, &temperature, &moisture, &light)
		if zone == 1 {
			res.One = append(res.One, HistoricData{zone, startTime, endTime, temperature, moisture, light})
		} else if zone == 2 {
			res.Two = append(res.Two, HistoricData{zone, startTime, endTime, temperature, moisture, light})
		} else if zone == 3 {
			res.Three = append(res.Three, HistoricData{zone, startTime, endTime, temperature, moisture, light})
		}
	}

	sendResponse(res, writer)
	printRequest(request)
}

// TEST: curl -d "zone=1&temperature=26&moisture=220&light=98" localhost:8080/api/live/upload
func uploadLiveData(writer http.ResponseWriter, request *http.Request) {
	// Get data from request
	request.ParseForm()
	time := time.Now().Unix()
	zone := toInt(request.Form.Get("zone"))
	temperature := toInt(request.Form.Get("temperature"))
	moisture := toInt(request.Form.Get("moisture"))
	light := toInt(request.Form.Get("light"))

	if zone <= 0 {
		// TODO: Should send bad response
		return
	}

	statement, err := database.Prepare("INSERT INTO live (zone, time, temperature, moisture, light) VALUES (?, ?, ?, ?, ?)")
	if err != nil {
		panic(err)
	}
	statement.Exec(zone, time, temperature, moisture, light)

	res := Message{"Success"}
	sendResponse(res, writer)
	printRequest(request)
}

func getLiveData(writer http.ResponseWriter, request *http.Request) {
	// Get parameters from request
	uri := request.URL.String()
	requestedZone := strings.Split(uri, "/api/live/zone/")[1]

	// Get data from db
	var time float64
	var zone, temperature, moisture, light int
	rows, err := database.Query("SELECT * FROM live WHERE zone == " + requestedZone + " ORDER BY time DESC LIMIT 1")
	if err != nil {
		panic(err)
	}

	for rows.Next() {
		rows.Scan(&zone, &time, &temperature, &moisture, &light)
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
