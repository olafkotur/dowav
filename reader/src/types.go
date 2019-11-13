package main

type Data struct {
	Time  int64 `json:"time"`
	Value int   `json:"value"`
}

type Readings struct {
	Zone        int  `json:"zone"`
	Temperature Data `json:"temp"`
	Moisture    Data `json:"moisture"`
	Light       Data `json:"light"`
	Location    Data `json:"location"`
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
