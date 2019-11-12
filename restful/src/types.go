package main

type Message struct {
	Message string `json:"message"`
}

type ReadingData struct {
	Time  float64 `json:"time"`
	Value int     `json:"value"`
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
