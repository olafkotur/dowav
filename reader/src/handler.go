package main

import "fmt"

func handleEnvironment(data string) {
	formatted := formatEnvironmentData(data)
	uploadLiveData(formatted)
	analyseEnvironmentData(formatted)
}

func handleLocation(data string) {
	formatted := formatLocationData(data)
	uploadLocationData(formatted)
	analyseLocationData(formatted)
}

func handleWater(data string) {
	formatted := formatWaterData(data)
	uploadWaterData(formatted)
	analyseWaterData(formatted)
}

func handleSettingUpdate(setting ZoneSetting) {
	zoneSettings[setting.Zone-1] = setting

	fmt.Println(setting)

	changeColor(hueUserId, hueUrl, setting.BulbColor, 1)
	changeBrightness(hueUserId, hueUrl, setting.BulbBrightness, 1)
}
