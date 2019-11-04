package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	staticPort := "8080"
	restPort := "8081"
	buildPath := "../../webapp/build"

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
