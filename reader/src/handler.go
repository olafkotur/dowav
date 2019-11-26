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
	fmt.Printf("Received new user setting of type %s with value of %s\n", data.Type, data.Setting)

	switch data.Type {
	case "lowTemperature":
	case "lowMoisture":
	case "lowLight":
	case "maxTemperature":
	case "maxLight":
	case "shouldSendTweets":
		if data.Setting == "true" {
			shouldSendTweets = true
		} else if data.Setting == "false" {
			shouldSendTweets = false
		}
	case "trackObject":
	}
}
