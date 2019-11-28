package main

import "fmt"

func handleEnvironment(data string) {
	formatted := formatEnvironmentData(data)
	uploadLiveData(formatted)
	checkEnvironmentTweet(formatted)
}

func handleLocation(data string) {
	formatted := formatLocationData(data)
	uploadLocationData(formatted)
	checkLocationTweet(formatted)
}

func handleWater(data string) {
	formatted := formatWaterData(data)
	uploadWaterData(formatted)
	checkWaterTweet(formatted)
}

func handleUserSetting(data Setting) {
	fmt.Printf("Received new user setting of type %s with value of %s\n", data.Type, data.Value)

	switch data.Type {
	case "minTemperature":
		minTemperature = toInt(data.Value)

	case "minMoisture":
		minMoisture = toInt(data.Value)

	case "minLight":
		minLight = toInt(data.Value)

	case "maxTemperature":
		maxTemperature = toInt(data.Value)

	case "maxLight":
		maxTemperature = toInt(data.Value)

	case "shouldSendTweets":
		if data.Value == "true" {
			shouldSendTweets = true
		} else if data.Value == "false" {
			shouldSendTweets = false
		}
	case "trackObject":
	}
}
