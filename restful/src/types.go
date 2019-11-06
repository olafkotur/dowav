package main

type Message struct {
	Message string `json:"message"`
}

type ReadingData struct {
	Time  float64 `json:"time"`
	Value int     `json:"value"`
}

type Readings struct {
	Temperature ReadingData `json:"temp"`
	Moisture    ReadingData `json:"moisture"`
	Light       ReadingData `json:"light"`
}

type HistoricData struct {
	Zone        int     `json:"zone"`
	StartTime   float64 `json:"startTime"`
	EndTime     float64 `json:"endTime"`
	Temperature int     `json:"temperature"`
	Moisture    int     `json:"moisture"`
	Light       int     `json:"light"`
}

type HistoricDataRes struct {
	One   []HistoricData `json:"1"`
	Two   []HistoricData `json:"2"`
	Three []HistoricData `json:"3"`
}
