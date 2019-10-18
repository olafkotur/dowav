package main

import (
	"log"
	"net/http"

	"github.com/argandas/serial"
)

const PORT = "8080"
const WEB_BUILD_PATH = "../webapp/build"
const SERIAL_PORT_NAME = "/dev/cu.usbmodem141302"
const SERIAL_PORT_BAUD = 115200

func main() {
	startServer()
	readSerial()
}

func startServer() {
	var fs = http.FileServer(http.Dir(WEB_BUILD_PATH))
	http.Handle("/", fs)

	log.Println("Listening on " + PORT + "...")
	go http.ListenAndServe(":"+PORT, nil)
}

func readSerial() {
	var sp = serial.New()
	var err = sp.Open(SERIAL_PORT_NAME, SERIAL_PORT_BAUD)
	if err != nil {
		panic(err)
	}

	for {
		sp.Read()
	}
}
