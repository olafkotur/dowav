package main

import (
	"github.com/argandas/serial"
)

const PORT = "8080"
const SERIAL_PORT_NAME = "/dev/cu.usbmodem141302"
const SERIAL_PORT_BAUD = 115200

func main() {
	// port := "8080"

	// fs := http.FileServer(http.Dir("../webapp/build"))
	// http.Handle("/", fs)

	// log.Println("Listening on " + port + "...")
	// http.ListenAndServe(":"+port, nil)
	readSerial()
}

func readSerial() {
	sp := serial.New()
	err := sp.Open(SERIAL_PORT_NAME, SERIAL_PORT_BAUD)
	if err != nil {
		panic(err)
	}

	for {
		sp.ReadLine()
	}
}
