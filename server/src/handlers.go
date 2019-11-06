package main

import (
	"net/http"
	"time"
)

func getLiveData(writer http.ResponseWriter, request *http.Request) {

	// TODO: Request data from db
	t := 1
	m := 2
	l := 3

	now := time.Now().Unix()
	data := Readings{
		ReadingData{now, t},
		ReadingData{now, m},
		ReadingData{now, l},
	}

	printRequest(request)
	sendResponse(data, writer)
}

func uploadData(writer http.ResponseWriter, request *http.Request) {
	type Data struct {
		Message string `json:"message"`
	}

	// Get data from request
	request.ParseForm()
	startTime := request.Form.Get("startTime")
	endTime := request.Form.Get("endTime")
	averageTemperature := request.Form.Get("temp")
	averageMoisture := request.Form.Get("moist")
	averageLight := request.Form.Get("light")

	// TODO: Upload to db

	res := Data{"Not yet implemented"}
	printRequest(request)
	sendResponse(res, writer)
}
