package main

import (
	"math/rand"
	"time"
)

func generateMockHistoricData() [24 * 12][6]int {
	const length = 24 * 12 // Past 24 hours, every 5 minutes
	var data [length][6]int
	var row [6]int

	now := time.Now()
	for i := 0; i < length; i++ {
		end := now.Add(-time.Duration(length-i-1) * 5 * time.Minute)
		start := end.Add(-time.Duration(5) * time.Minute)

		row[0] = rand.Intn(3) + 1
		row[1] = int(start.Unix())
		row[2] = int(end.Unix())
		row[3] = rand.Intn(3) + 25
		row[4] = rand.Intn(590) + 10
		row[5] = rand.Intn(140) + 10

		data[i] = row
	}

	return data
}

func uploadMockHistoricData(data [24 * 12][6]int) {
	for _, d := range data {
		statement, _ := database.Prepare("INSERT INTO historic (zone, startTime, endTime, temperature, moisture, light) VALUES (?, ?, ?, ?, ?, ?)")
		_, err := statement.Exec(d[0], float64(d[1]), float64(d[2]), d[3], d[4], d[5])
		if err != nil {
			panic(err)
		}
	}
}
