package main

import (
	"fmt"
	"log"
	"time"
)

func startProcessingData(interval time.Duration) {
	log.Printf("Starting to process data for the last %d seconds\n", interval/time.Second)
	fmt.Println("")
}
