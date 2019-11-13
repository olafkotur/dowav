package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
)

var database *sql.DB

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	database, _ = sql.Open("sqlite3", "./database.db")

	// Create historic table in database
	statement, _ := database.Prepare("CREATE TABLE IF NOT EXISTS historic (zone INTEGER, startTime REAL, endTime REAL, temperature INTEGER, moisture INTEGER, light INTEGER)")
	_, err := statement.Exec()
	if err != nil {
		panic(err)
	}

	// Create live table in database
	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS live (zone INTEGER, time REAL, temperature INTEGER, moisture INTEGER, light INTEGER)")
	_, err = statement.Exec()
	if err != nil {
		panic(err)
	}

	// Create location table in database
	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS location (time REAL, zone INTEGER)")
	_, err = statement.Exec()
	if err != nil {
		panic(err)
	}

	historicData := generateMockHistoricData()
	uploadMockHistoricData(historicData)

	// Server routing
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/api/historic/upload", uploadHistoricData).Methods("POST")
	router.HandleFunc("/api/historic/{sensor}", getHistoricData).Methods("GET")
	router.HandleFunc("/api/live/upload", uploadLiveData).Methods("POST")
	router.HandleFunc("/api/live/{sensor}", getLiveData).Methods("GET")
	router.HandleFunc("/api/location/upload", uploadLocationData).Methods("POST")
	router.HandleFunc("/api/location/{type}", getLocationData).Methods("GET")

	log.Printf("Serving restful on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

func printRequest(request *http.Request) {
	log.Printf("Method: %s\n", request.Method)
	log.Printf("URL: %s\n\n", request.URL)
}

func sendResponse(res interface{}, writer http.ResponseWriter) {
	response, _ := json.Marshal(res)
	writer.Header().Set("Content-Type", "application/json")
	writer.Header().Set("Access-Control-Allow-Origin", "*")
	writer.Header().Set("Access-Control-Allow-Methods", "POST, GET")
	writer.Header().Set("Access-Control-Max-Age", "2592000")
	_, err := writer.Write(response)
	if err != nil {
		panic(err)
	}
}

func getMuxVariable(target string, request *http.Request) (v string) {
	return mux.Vars(request)[target]
}

func toInt(s string) (i int) {
	res, _ := strconv.Atoi(s)
	return res
}

func toFloat(s string) (f float64) {
	res, _ := strconv.ParseFloat(s, 64)
	return res
}

func toString(i int) (s string) {
	return strconv.Itoa(i)
}
