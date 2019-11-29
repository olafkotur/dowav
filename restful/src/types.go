package main

import (
	"database/sql"
)

type Message struct {
	Message string `json:"message"`
}

type Notification struct {
	Time    float64 `json:"time"`
	Message string  `json:"message"`
	Type    string  `json:"type"`
}
type ReadingData struct {
	Time  float64 `json:"time"`
	Value float64 `json:"value"`
}

type WaterData struct {
	Time   float64 `json:"time"`
	Volume float64 `json:"volume"`
	Tilt   float64 `json:"tilt"`
}

type Setting struct {
	Time  float64 `json:"time"`
	Type  string  `json:"type"`
	Value string  `json:"value"`
}

type PlantSettings struct {
	Zone             *int64  `json:"zone,omitempty"`
	Plant            string  `json:"plant"`
	ShouldSendTweets bool    `json:"shouldSendTweets"`
	MinTemperature   int     `json:"minTemperature"`
	MaxTemperature   int     `json:"maxTemperature"`
	MinLight         int     `json:"minLight"`
	MaxLight         int     `json:"maxLight"`
	MinMoisture      int     `json:"minMoisture"`
	LastUpdate       float64 `json:"-"`
}

type ZoneTableRow struct {
	id      int
	plantId sql.NullInt64
}

// type Readings struct {
// 	Temperature ReadingData `json:"temperature"`
// 	Moisture    ReadingData `json:"moisture"`
// 	Light       ReadingData `json:"light"`
// }

// type FullData struct {
// 	Zone        int     `json:"zone"`
// 	StartTime   float64 `json:"startTime"`
// 	EndTime     float64 `json:"endTime"`
// 	Temperature int     `json:"temperature"`
// 	Moisture    int     `json:"moisture"`
// 	Light       int     `json:"light"`
// }
