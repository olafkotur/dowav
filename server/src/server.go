package main

import (
	"log"
	"net/http"
)

func startServer(path, port string) {
	var fs = http.FileServer(http.Dir(path))
	http.Handle("/", fs)

	log.Printf("Listening on %s...\n\n", port)
	http.ListenAndServe(":"+port, nil)
}
