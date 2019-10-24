package main

import (
	"log"
	"time"
)

func startScheduler() {
	refreshRate := 1 * time.Second
	timeSinceLastRun := 10 * time.Second
	processDataInterval := 10 * time.Second

	for {
		// Process data
		if timeSinceLastRun >= processDataInterval {
			log.Printf("Starting to process data for the last %d minutes\n", processDataInterval/time.Minute)
			startProcessingData(processDataInterval)
			timeSinceLastRun = 0 * time.Second
		} else {
			timeSinceLastRun += 1 * time.Second
		}

		time.Sleep(refreshRate)
	}

}
