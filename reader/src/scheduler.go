package main

import (
	"log"
	"time"
)

func startScheduler() {
	log.Printf("Starting the scheduler\n")

	refreshRate := 1 * time.Second
	timeSinceLastRun := 0 * time.Minute
	processDataInterval := 5 * time.Second

	for {
		// Process data
		if timeSinceLastRun >= processDataInterval {
			log.Printf("Starting to process raw data...\n")
			timeSinceLastRun = 0 * time.Second
			startProcessingData(processDataInterval)
		} else {
			timeSinceLastRun += 1 * time.Second
		}

		time.Sleep(refreshRate)
	}

}
