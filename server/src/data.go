package main

import (
	"bufio"
	"fmt"
	"log"
	"strconv"

	"github.com/tarm/serial"
)

// func readSerial(name, baud string) {
// 	var baudInt, err = strconv.Atoi(baud)
// 	if err != nil {
// 		panic(err)
// 	}

// 	var sp = serial.New()
// 	err = sp.Open(name, baudInt)
// 	if err != nil {
// 		panic(err)
// 	}
// 	// defer sp.Close()

// 	for {
// 		var str, err = sp.ReadLine()
// 		if err != nil {
// 			continue
// 		} else {
// 			formatData(str)
// 		}
// 	}
// }

func readSerial(name, baud string) {
	baudInt, err := strconv.Atoi(baud)
	if err != nil {
		panic(err)
	}

	conf := &serial.Config{Name: name, Baud: baudInt}
	sp, err := serial.OpenPort(conf)
	if err != nil {
		log.Fatalf("serial.Open: %v", err)
	}

	for {
		reader := bufio.NewReader(sp)
		bytes, _ := reader.ReadBytes('\x0a')
		str := string(bytes)
		fmt.Println(str)
	}
}

func formatData(data string) {
}
