package main

import (
	"strconv"

	"github.com/argandas/serial"
)

func readSerial(name, baud string) {
	var baudInt, err = strconv.Atoi(baud)
	if err != nil {
		panic(err)
	}

	var sp = serial.New()
	err = sp.Open(name, baudInt)
	if err != nil {
		panic(err)
	}

	for {
		sp.Read()
	}
}
