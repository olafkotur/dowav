package main

type Data struct {
	Time  int64 `json:"time"`
	Value int   `json:"value"`
}

type Environment struct {
	Zone        int  `json:"zone"`
	Temperature Data `json:"temp"`
	Moisture    Data `json:"moisture"`
	Light       Data `json:"light"`
}

type Location struct {
	UserId int `json:"userId"`
	Zone   int `json:"zone"`
}

type Water struct {
	Zone           int `json:"zone"`
	AccelerometerX int `json:"accelerometerX"`
	AccelerometerY int `json:"accelerometerY"`
	AccelerometerZ int `json:"accelerometerZ"`
	Depth          int `json:"depth"`
}

type Calculations struct {
	Average float64 `json:"average"`
	Minimum int     `json:"minimum"`
	Maximum int     `json:"maximum"`
}

type HistoricData struct {
	Zone        int          `json:"zone"`
	StartTime   int          `json:"startTime"`
	EndTime     int          `json:"endTime"`
	Temperature Calculations `json:"temperature"`
	Moisture    Calculations `json:"moisture"`
	Light       Calculations `json:"light"`
}

type ZoneSetting struct {
	Zone             int    `json:"zone"`
	Plant            string `json:"plant"`
	ShouldSendTweets bool   `json:"shouldSendTweets"`
	MinTemperature   int    `json:"minTemperature"`
	MaxTemperature   int    `json:"maxTemperature"`
	MinLight         int    `json:"minLight"`
	MaxLight         int    `json:"maxLight"`
	MinMoisture      int    `json:"minMoisture"`
	BulbColor        string `json:"bulbColor"`
	BulbBrightness   int    `json:"bulbBrightness"`
}

type HealthData struct {
	Id    int     `json:"id"`
	Plant string  `json:"plant"`
	Time  float64 `json:"time"`
	Soil  string  `json:"soil"`
	Stem  string  `json:"stem"`
	Leaf  string  `json:"leaf"`
}
