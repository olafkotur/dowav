package main

import (
	"fmt"
	"log"
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
	fmt.Println(zone, temperature, moisture, light)
	re, er := statement.Exec(zone, startTime, endTime, temperature, moisture, light)
	fmt.Println(re, er)

	res := Message{"Success"}
	sendResponse(res, writer)
	printRequest(request)
}

// localhost:8080/api/historic/temp/1
func getHistoricData(writer http.ResponseWriter, request *http.Request) {
	// Safety in case no paramters are entered
	if strings.Contains(request.URL.String(), "zone=") != true || strings.Contains(request.URL.String(), "from=") != true || strings.Contains(request.URL.String(), "to=") != true {
		// TODO: Add a bad request here
		return
	}

	// Get parameters from request
	zone := request.URL.Query()["zone"][0]
	from := request.URL.Query()["from"][0]
	to := request.URL.Query()["to"][0]
	dataType := strings.Split(request.URL.String(), "/api/historic/")[1]
	dataType = strings.Split(dataType, "?")[0]
	log.Println(dataType, zone)

	// Fetch from the db
	rows, err := database.Query("SELECT endTime, " + dataType + " FROM historic WHERE zone == " + zone + " AND startTime >= " + from + " AND endTime <= " + to + " ORDER BY zone ASC")
	if err != nil {
		panic(err)
	}

	var res []ReadingData
	var endTime float64
	var data int

	// Populate response from the db
	for rows.Next() {
		rows.Scan(&endTime, &data)
		res = append(res, ReadingData{endTime * 1000, data})
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

// https://dowav-api.herokuapp.com/api/live/temperature
func getLiveData(writer http.ResponseWriter, request *http.Request) {
	// Get parameters from request
	sensor := getMuxVariable("sensor", request)

	var res []ReadingData
	for i := 0; i < 3; i++ {
		// Get data from db
		var time float64
		var sensorValue int
		rows, err := database.Query("SELECT time, " + sensor + " FROM live WHERE zone == " + toString(i+1) + " ORDER BY time DESC LIMIT 1")
		if err != nil {
			panic(err)
		}

		for rows.Next() {
			rows.Scan(&time, &sensorValue)
		}
		rows.Close()

		// Format data
		data := ReadingData{time * 1000, sensorValue}
		res = append(res, data)
	}

	sendResponse(res, writer)
	printRequest(request)
}
