package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	buildPath := os.Getenv("BUILD_PATH")
	if buildPath == "" {
		buildPath = "../../webapp/build"
	}

	fs := http.FileServer(http.Dir(buildPath))
	http.Handle("/", fs)

	log.Printf("Serving static on port %s...\n", port)
	http.ListenAndServe(":"+port, nil)
}
