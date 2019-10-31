package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

func startServer(port, path string) {
	var fs = http.FileServer(http.Dir(path))
	http.Handle("/", fs)

	log.Printf("Listening on %s...\n\n", port)
	http.ListenAndServe(":"+port, nil)
}

// Creates web socket for each channel passed into the function
func sendSocketData(channels []chan string) {
	for i := 1; i <= len(channels); i++ { // Starts at 1 by design
		zone := i
		go http.HandleFunc("/live/zone/"+toString(zone), func(writer http.ResponseWriter, request *http.Request) {
			handleSocket(zone, channels, writer, request)
		})
	}
}

// Sends data via the websocket from the channel
func handleSocket(zone int, channels []chan string, writer http.ResponseWriter, request *http.Request) {
	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}

	log.Println("Successfuly established web socket connection on /live/zone/" + toString(zone))
	conn, err := upgrader.Upgrade(writer, request, nil)
	if err != nil {
		panic(err)
	}

	for {
		data := <-channels[zone-1]
		conn.WriteMessage(1, []byte(data))
	}
}
