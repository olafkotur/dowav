package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
)

// TEST: curl -d "zone=3&startTime=1573593116&endTime=1573593216&temperature=29&moisture=233&light=110" dowav-api.herokuapp.com/:8080/api/historic/upload
func uploadHistoricData(writer http.ResponseWriter, request *http.Request) {
	// Get data from request
	_ = request.ParseForm()
	zone := toInt(request.Form.Get("zone"))
	startTime := toFloat(request.Form.Get("startTime"))
	endTime := toFloat(request.Form.Get("endTime"))
	temperature := toFloat(request.Form.Get("temperature"))
	moisture := toFloat(request.Form.Get("moisture"))
	light := toFloat(request.Form.Get("light"))

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

// /api/historic/temperature?from=1573398000&to=1573398300
func getHistoricData(writer http.ResponseWriter, request *http.Request) {
	// Safety in case no paramters are entered
	if !strings.Contains(request.URL.String(), "from=") || !strings.Contains(request.URL.String(), "to=") {
		// TODO: Add a bad request here
		return
	}

	// Get parameters from request
	from := request.URL.Query()["from"][0]
	to := request.URL.Query()["to"][0]
	sensor := getMuxVariable("sensor", request)

	var res [][]ReadingData
	for i := 0; i < 3; i++ {
		var hisData []ReadingData
		// Fetch from the db
		rows, err := database.Query("SELECT endTime, " + sensor + " FROM historic WHERE zone == " + toString(i+1) + " AND startTime >= " + from + " AND endTime <= " + to + " ORDER BY zone ASC")
		if err != nil {
			panic(err)
		}

		var endTime float64
		var sensorData float64

		// Populate response from the db
		for rows.Next() {
			_ = rows.Scan(&endTime, &sensorData)
			hisData = append(hisData, ReadingData{endTime * 1000, sensorData})
		}
		res = append(res, hisData)
	}

	sendResponse(res, writer)
	printRequest(request)
}

// TEST: curl -d "zone=1&temperature=26&moisture=220&light=98" localhost:8080/api/live/upload
func uploadLiveData(writer http.ResponseWriter, request *http.Request) {
	// Get data from request
	_ = request.ParseForm()
	time := time.Now().Unix()
	zone := toInt(request.Form.Get("zone"))
	temperature := toInt(request.Form.Get("temperature"))
	moisture := toInt(request.Form.Get("moisture"))
	light := toInt(request.Form.Get("light"))

	if zone <= 0 {
		// TODO: Should send bad response
		return
	}

	statement, _ := database.Prepare("INSERT INTO live (zone, time, temperature, moisture, light) VALUES (?, ?, ?, ?, ?)")
	_, err := statement.Exec(zone, time, temperature, moisture, light)
	if err != nil {
		panic(err)
	}

	res := Message{"Success"}
	sendResponse(res, writer)
	printRequest(request)
}

func getLiveData(writer http.ResponseWriter, request *http.Request) {
	// Get parameters from request
	sensor := getMuxVariable("sensor", request)

	var res []ReadingData
	for i := 0; i < 3; i++ {
		// Get data from db
		var time float64
		var sensorValue float64
		rows, err := database.Query("SELECT time, " + sensor + " FROM live WHERE zone == " + toString(i+1) + " ORDER BY time DESC LIMIT 1")
		if err != nil {
			panic(err)
		}

		for rows.Next() {
			_ = rows.Scan(&time, &sensorValue)
		}
		rows.Close()

		// Format data
		data := ReadingData{time * 1000, sensorValue}
		res = append(res, data)
	}

	sendResponse(res, writer)
	printRequest(request)
}

func uploadLocationData(writer http.ResponseWriter, request *http.Request) {
	// Get data from request
	_ = request.ParseForm()
	time := toFloat(request.Form.Get("time"))
	zone := toInt(request.Form.Get("zone"))

	if zone < 0 {
		// TODO: Should send bad response
		return
	}

	statement, _ := database.Prepare("INSERT INTO location (time, zone) VALUES (?, ?)")
	_, err := statement.Exec(time, zone)
	if err != nil {
		panic(err)
	}

	res := Message{"Success"}
	sendResponse(res, writer)
	printRequest(request)
}

func getLocationData(writer http.ResponseWriter, request *http.Request) {
	// Get parameters from request
	dataType := getMuxVariable("type", request)

	var res interface{}
	var now float64
	var location float64

	// Fetch and return live data
	if dataType == "live" {
		// Scan db and save to var
		rows, _ := database.Query("SELECT * FROM location ORDER BY time DESC LIMIT 1")
		for rows.Next() {
			_ = rows.Scan(&now, &location)
		}
		rows.Close()
		res = ReadingData{now * 1000, location}

	}

	// Fetch and return historic data
	if dataType == "historic" {
		timeRange := int(time.Now().Add(-time.Duration(time.Hour * 24)).Unix())

		// Scan db and save to var
		var data []ReadingData
		rows, _ := database.Query("SELECT * FROM location WHERE time > " + toString(timeRange))
		for rows.Next() {
			_ = rows.Scan(&now, &location)
			data = append(data, ReadingData{now * 1000, location})
		}
		rows.Close()
		res = data
	}

	sendResponse(res, writer)
	printRequest(request)
}

func postTweet(writer http.ResponseWriter, request *http.Request) {
	_ = request.ParseForm()
	msg := request.Form.Get("message")
	if msg == "" {
		return
	}

	config := oauth1.NewConfig("MThFJvVlV5zgpM52v0v9WriM6", "gv4ypIp5G5QaxsGVAXNVxJSRrwb5ednzumk3fWD2917fO9B5WM")
	token := oauth1.NewToken("1196375364907470848-3VNKCnMblHl306D20PW3jJTwq6ZXOn", "Tm0hFLXmusLKCXwnlJi4w7QTIQdzNTKeehEi5wBaI7pDV")
	httpClient := config.Client(oauth1.NoContext, token)
	client := twitter.NewClient(httpClient)

	_, res, err := client.Statuses.Update(msg, nil)
	if err != nil {
		log.Println(err)
	}
	res.Body.Close()

	printRequest(request)
	sendResponse(res, writer)
}

func getTweets(writer http.ResponseWriter, request *http.Request) {
	config := oauth1.NewConfig("MThFJvVlV5zgpM52v0v9WriM6", "gv4ypIp5G5QaxsGVAXNVxJSRrwb5ednzumk3fWD2917fO9B5WM")
	token := oauth1.NewToken("1196375364907470848-3VNKCnMblHl306D20PW3jJTwq6ZXOn", "Tm0hFLXmusLKCXwnlJi4w7QTIQdzNTKeehEi5wBaI7pDV")
	httpClient := config.Client(oauth1.NoContext, token)
	client := twitter.NewClient(httpClient)

	list, res, err := client.Timelines.UserTimeline(&twitter.UserTimelineParams{UserID: 1196375364907470848})
	if err != nil {
		log.Println(err)
	}
	res.Body.Close()

	printRequest(request)
	sendResponse(list, writer)
}
