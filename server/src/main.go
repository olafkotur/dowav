package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
)

// curl -d "startTime=1&endTime=2&temperature=28&moisture=289&light=80" localhost:8081/api/data/upload
// curl -d "temperature=28&moisture=289&light=80" localhost:8081/api/live/upload

var database *sql.DB

func main() {
	staticPort := "8080"
	restPort := "8081"
	buildPath := "../../webapp/build"

	var err error
	database, err = sql.Open("sqlite3", "./database.db")
	if err != nil {
		panic(err)
	}
	insertTables()

	go serveStatic(staticPort, buildPath)
	serveRestful(restPort)
}

func serveStatic(port, path string) {
	fs := http.FileServer(http.Dir(path))
	http.Handle("/", fs)

	log.Printf("Serving static on port %s...\n", port)
	http.ListenAndServe(":"+port, nil)
}

func serveRestful(port string) {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/api/data/upload", uploadData).Methods("POST")
	router.HandleFunc("/api/live/upload", uploadLiveData).Methods("POST")
	router.HandleFunc("/api/live/zone/{id}", getLiveData).Methods("GET")

	log.Printf("Serving restful on port %s...\n", port)
	http.ListenAndServe(":"+port, router)
}

func insertTables() {
	statement, _ := database.Prepare("CREATE TABLE IF NOT EXISTS historic (startTime REAL PRIMARY KEY, endTime REAL, averageTemperature INTEGER, averageMoisture INTEGER, averageLight INTEGER)")
	statement.Exec()
	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS live (time REAL PRIMARY KEY, temperature INTEGER, moisture INTEGER, light INTEGER)")
	statement.Exec()
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
