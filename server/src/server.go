package main

import (
	"fmt"
	"net/http"
)

func startServer(path, port string) {
	var fs = http.FileServer(http.Dir(path))
	http.Handle("/", fs)

	fmt.Println("Listening on " + port + "...")
	go http.ListenAndServe(":"+port, nil)
}
