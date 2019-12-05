package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	port := getPort()
	buildPath := getPath()

	fs := http.FileServer(http.Dir(buildPath))
	http.Handle("/", fs)

	log.Printf("Serving static on port %s...\n", port)
	http.ListenAndServe(":"+port, nil)
}

func getPort() (p string) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	return port
}

func getPath() (p string) {
	path := os.Getenv("BUILD_PATH")
	if path == "" {
		path = "../../webapp/build"
	}
	fmt.Println(path)
	return path
}
