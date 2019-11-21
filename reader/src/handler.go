package main

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
	checkWaterTweet(formatted)
}
