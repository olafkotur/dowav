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

type PlantSettings struct {
	Zone             *int64  `json:"zone,omitempty"`
	Plant            string  `json:"plant"`
	ShouldSendTweets bool    `json:"shouldSendTweets"`
	MinTemperature   int     `json:"minTemperature"`
	MaxTemperature   int     `json:"maxTemperature"`
	MinLight         int     `json:"minLight"`
	MaxLight         int     `json:"maxLight"`
	MinMoisture      int     `json:"minMoisture"`
	BulbColor        string  `json:"bulbColor"`
	BulbBrightness   int     `json:"bulbBrightness"`
	LastUpdate       float64 `json:"-"`
}

type ZoneTableRow struct {
	id      int
	plantId sql.NullInt64
}

type HealthData struct {
	Id   int     `json:"id"`
	Time float64 `json:"time"`
	Soil string  `json:"soil"`
	Stem string  `json:"stem"`
	Leaf string  `json:"leaf"`
}
