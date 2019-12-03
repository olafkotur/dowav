package main

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
	changeColor(hueUserId, hueUrl, setting.BulbColor, setting.Zone)
	changeBrightness(hueUserId, hueUrl, setting.BulbBrightness, setting.Zone)
}
