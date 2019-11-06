package main

type ReadingData struct {
	Time  int64 `json:"time"`
	Value int   `json:"value"`
}

type Readings struct {
	Temperature ReadingData `json:"temp"`
	Moisture    ReadingData `json:"moisture"`
	Light       ReadingData `json:"light"`
}
