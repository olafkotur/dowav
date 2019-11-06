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

	// Prepare database tables
	database, _ = sql.Open("sqlite3", "./database.db")
	statement, _ := database.Prepare("CREATE TABLE IF NOT EXISTS historic (zone INTEGER, startTime REAL PRIMARY KEY, endTime REAL, averageTemperature INTEGER, averageMoisture INTEGER, averageLight INTEGER)")
	statement.Exec()
	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS live (time REAL PRIMARY KEY, temperature INTEGER, moisture INTEGER, light INTEGER)")
	statement.Exec()

	// Server routing
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/api/historic/upload", uploadHistoricData).Methods("POST")
	router.HandleFunc("/api/live/upload", uploadLiveData).Methods("POST")
	router.HandleFunc("/api/live/zone/{id}", getLiveData).Methods("GET")

	log.Printf("Serving restful on port %s...\n", port)
	http.ListenAndServe(":"+port, router)
}

func printRequest(request *http.Request) {
	log.Printf("Method: %s\n", request.Method)
	log.Printf("URL: %s\n", request.URL)
}

func sendResponse(res interface{}, writer http.ResponseWriter) {
	response, _ := json.Marshal(res)
	writer.Header().Set("Content-Type", "application/json")
	writer.Write(response)
}

func toInt(s string) (i int) {
	res, _ := strconv.Atoi(s)
	return res
}

func toFloat(s string) (f float64) {
	res, _ := strconv.ParseFloat(s, 64)
	return res
}
