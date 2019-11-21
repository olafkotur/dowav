package main

import (
	"encoding/json"
	"net/http"
	"net/url"
)

func checkTweetValidity(d []byte) {
	var data Environment
	_ = json.Unmarshal(d, &data)

	// Temperature
	if data.Temperature.Value <= 18 {
		postTweet("The temperature seems to be below the recommend value in zone " + toString(data.Zone) + " #warning #low #temperature")
	} else if data.Temperature.Value >= 35 {
		postTweet("The temperature seems to be above the recommend value in zone " + toString(data.Zone) + " #warning #high #temperature")
	}

	// Moisture
	if data.Moisture.Value <= 50 {
		postTweet("The moisture level seems to be below the recommend value in zone " + toString(data.Zone) + " #warning #low #moisture")
	}

	// Light
	if data.Light.Value <= 20 {
		postTweet("The light level seems to be below the recommend value in zone " + toString(data.Zone) + " #warning #low #light")

	} else if data.Light.Value >= 225 {
		postTweet("The light level seems to be above the recommend value in zone " + toString(data.Zone) + " #warning #high #light")
	}
}

func postTweet(msg string) {
	// Define the form values
	values := url.Values{
		"message": {msg},
	}
	res, err := http.PostForm("http://dowav-api.herokuapp.com/api/tweet", values)
	if err != nil {
		return
	}
	res.Body.Close()
}
