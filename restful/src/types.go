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
