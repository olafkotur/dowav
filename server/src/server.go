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

func sendSocketData(serialChan chan string) {
	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}

	http.HandleFunc("/live/data", func(writer http.ResponseWriter, request *http.Request) {
		log.Println("Successfuly established web socket connection on /live/data")
		conn, err := upgrader.Upgrade(writer, request, nil)
		if err != nil {
			panic(err)
		}

		for {
			data := <-serialChan
			conn.WriteMessage(1, []byte(data))
		}
	})
}
