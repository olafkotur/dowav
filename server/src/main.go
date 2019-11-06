package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
)

var database *sql.DB

func main() {
	staticPort := "8080"
	restPort := "8081"
	buildPath := "../../webapp/build"

	database, _ = sql.Open("sqlite3", "./database.db")
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
	router.HandleFunc("/api/upload", uploadData).Methods("POST")
	router.HandleFunc("/api/live/data/{id}", getLiveData).Methods("GET")

	log.Printf("Serving restful on port %s...\n", port)
	http.ListenAndServe(":"+port, router)
}

func insertTables() {
	statement, _ := database.Prepare("CREATE TABLE IF NOT EXISTS historic (startTime REAL PRIMARY KEY, endTime REAL, averageTemperature INTEGER, averageMoisture INTEGER, averageLight INTEGER)")
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
