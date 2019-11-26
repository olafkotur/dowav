package main

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
	Value string  `json:"Value"`
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
