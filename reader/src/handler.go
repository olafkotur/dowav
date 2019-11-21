package main

func handleEnvironment(data string) {
	formatted := formatEnvironmentData(data)
	uploadLiveData(formatted)
	checkTweetValidity(formatted)
}

func handleLocation(data string) {
	formatted := formatLocationData(data)
	checkTweetValidity(formatted)
}

func handleWater(data string) {
	formatted := formatWaterData(data)
	checkTweetValidity(formatted)
}
