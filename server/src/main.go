package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	var err = godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
		log.Fatal("Error loading .env file")
	}

	// Enviornment variables
	STATIC_SERVER_PORT := os.Getenv("STATIC_SERVER_PORT")
	REST_SERVER_PORT := os.Getenv("REST_SERVER_PORT")
	WEB_BUILD_PATH := os.Getenv("WEB_BUILD_PATH")

	go serveStatic(STATIC_SERVER_PORT, WEB_BUILD_PATH)
	serveRestful(REST_SERVER_PORT)
}

func serveStatic(port, path string) {
	fs := http.FileServer(http.Dir(path))
	http.Handle("/", fs)

	log.Printf("Serving static on port %s...\n", port)
	http.ListenAndServe(":"+port, nil)
}

func serveRestful(port string) {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/api", sayHello)

	log.Printf("Serving restful on port %s...\n", port)
	http.ListenAndServe(":"+port, router)

}

func sayHello(writer http.ResponseWriter, request *http.Request) {
	fmt.Println("Hello")
	type Data struct {
		Message string `json:"message"`
	}

	data := Data{"Hello World"}
	response, _ := json.Marshal(data)

	fmt.Println("Yuppp")
	writer.Header().Set("Content-Type", "application/json")
	writer.Write(response)
}
