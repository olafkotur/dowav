package main

import (
	"net/http"
)

func uploadData(writer http.ResponseWriter, request *http.Request) {
	type Data struct {
		Message string `json:"message"`
	}

	res := Data{"Not yet implemented"}
	printRequest(request)
	sendResponse(res, writer)
}
