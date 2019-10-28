package main

import (
	"log"
	"time"
)

func startScheduler() {
	log.Printf("Starting the scheduler\n")

	refreshRate := 1 * time.Second
	timeSinceLastRun := 10 * time.Second
	processDataInterval := 10 * time.Second

	for {
		// Process data
		if timeSinceLastRun >= processDataInterval {
			log.Printf("Starting to process raw data...\n")
			startProcessingData(processDataInterval)
			timeSinceLastRun = 0 * time.Second
		} else {
			timeSinceLastRun += 1 * time.Second
		}

		time.Sleep(refreshRate)
	}

}
