package main

import (
	"log"
	"net/http"
)

func startServer(path, port string) {
	var fs = http.FileServer(http.Dir(path))
	http.Handle("/", fs)

	log.Println("Listening on " + port + "...")
	go http.ListenAndServe(":"+port, nil)
}
