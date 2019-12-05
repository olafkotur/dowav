package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/rgamba/evtwebsocket"
)

var previousTweet string
var previousNotification string
var previousMoisture [3]int
var previousStatus string
var lastTweetSent int64
var lastNotificationSent int64
var lastStatusSent int64
var timeout = int64(10)

var zoneSettings []ZoneSetting

func listenUserSettings() {
	conn := evtwebsocket.Conn{
		OnMessage: func(msg []byte, w *evtwebsocket.Conn) {
			var settings []ZoneSetting
			_ = json.Unmarshal([]byte(msg), &settings)
			fmt.Println(settings)
			for _, s := range settings {
				if s.Zone != 0 {
					fmt.Println("Received new setting change request, updating:", s)
					handleSettingUpdate(s)
				}
			}
		},
		OnError: func(err error) {
			listenUserSettings() // Reconnect
		},
	}
	err := conn.Dial("ws://dowav-api.herokuapp.com/api/setting", "GET")
	if err != nil {
		log.Println(err)
	}
}

func analyseEnvironmentData(d []byte) {
	var data Environment
	var msg string
	_ = json.Unmarshal(d, &data)

	if previousMoisture[data.Zone-1] >= 1 {
		previousMoisture[data.Zone-1] = previousMoisture[data.Zone-1] - 2
	}

	for _, setting := range zoneSettings {
		if setting.Zone == 0 {
			continue
		}

		// Temperature
		if data.Temperature.Value <= setting.MinTemperature {
			msg = "The temperature seems to be below the recommend value in zone " + toString(data.Zone) + " #warning #low #temperature"
			updateHealthStatus(data.Zone, "stem", "The temperature is a little low which can affect the germination of the plant")
		} else if data.Temperature.Value >= setting.MaxTemperature {
			msg = "The temperature seems to be above the recommend value in zone " + toString(data.Zone) + " #warning #high #temperature"
			updateHealthStatus(data.Zone, "soil", "The plant may not be getting enough water due to the high temperatures")
		}

		// Moisture
		if data.Moisture.Value <= setting.MinMoisture {
			msg = "The moisture level seems to be below the recommend value in zone " + toString(data.Zone) + " #warning #low #moisture"
			updateHealthStatus(data.Zone, "soil", "The plant needs a little more water to help it grow")
		}

		if data.Moisture.Value-previousMoisture[data.Zone-1] > 300 {
			previousMoisture[data.Zone-1] = data.Moisture.Value
			pushNotification("Increasing the light level in zone "+toString(data.Zone)+" due to a large increase in plant moisture", "info")
			changeBrightness(hueUserId, hueUrl, data.Zone, 254)
		}

		// Light
		if data.Light.Value <= setting.MinLight {
			msg = "The light level seems to be below the recommend value in zone " + toString(data.Zone) + " #warning #low #light"
			updateHealthStatus(data.Zone, "leaf", "The plant needs a little more light to help it grow")
		} else if data.Light.Value >= setting.MaxLight {
			msg = "The light level seems to be above the recommend value in zone " + toString(data.Zone) + " #warning #high #light"
			updateHealthStatus(data.Zone, "leaf", "The light is quite high, this could damage the leaves in the future!")
		}

		// Send tweet and notification
		if msg != "" {
			postTweet(data.Zone, msg)
			pushNotification(msg, "info")
		}
	}
}

func analyseLocationData(d []byte) {
	var data Location
	_ = json.Unmarshal(d, &data)

	if data.Zone != 0 && previousLocation != 0 {
		msg := "A user has entered the green house and is now in zone " + toString(data.Zone) + " #wearefamily"
		changeBrightness(hueUserId, hueUrl, 254, data.Zone)
		postTweet(data.Zone, msg)
		pushNotification(msg, "success")
	}
}

func analyseWaterData(d []byte) {
	var data Water
	_ = json.Unmarshal(d, &data)

	if data.Depth <= 0 {
		msg := "The watering can has ran out of water! #warning #low #water"
		postTweet(data.Zone, msg)
		pushNotification(msg, "info")
	}
}

func postTweet(zone int, msg string) {
	if shouldTimeout(lastTweetSent) {
		return
	}
	if !zoneSettings[zone].ShouldSendTweets || msg == previousTweet {
		return
	}
	previousTweet = msg
	fmt.Println("Tweeting:", msg)

	// Define the form values
	values := url.Values{
		"message": {msg},
	}
	res, err := http.PostForm("http://dowav-api.herokuapp.com/api/tweet", values)
	if err != nil {
		return
	}
	res.Body.Close()
	lastTweetSent = time.Now().Unix()
}

func pushNotification(msg, messageType string) {
	// Remove any hashtags from the message
	if strings.Contains(msg, "#") {
		msg = strings.Split(msg, "#")[0]
	}

	if msg == previousNotification {
		return
	}
	previousNotification = msg
	fmt.Println("Sending Notification:", msg)

	// Define the form values
	values := url.Values{
		"message": {msg},
		"type":    {messageType},
	}
	res, err := http.PostForm("http://dowav-api.herokuapp.com/api/notification", values)
	if err != nil {
		return
	}
	res.Body.Close()
	lastNotificationSent = time.Now().Unix()
}

func updateHealthStatus(zoneId int, typ, msg string) {
	if shouldTimeout(lastStatusSent) {
		return
	}

	if msg == previousStatus {
		return
	}
	previousStatus = msg
	fmt.Println("Updating health:", msg)

	// Get previous health status
	res, err := http.Get("http://dowav-api.herokuapp.com/api/health")
	if err != nil {
		log.Println(err)
	}

	// Read status data
	var previousHealth []HealthData
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Println(err)
	}
	res.Body.Close()
	_ = json.Unmarshal(body, &previousHealth)

	var values url.Values
	if typ == "soil" {
		values = url.Values{
			"soil": {msg},
			"stem": {previousHealth[zoneId-1].Stem},
			"leaf": {previousHealth[zoneId-1].Leaf},
		}
	} else if typ == "stem" {
		values = url.Values{
			"soil": {previousHealth[zoneId-1].Stem},
			"stem": {msg},
			"leaf": {previousHealth[zoneId-1].Leaf},
		}
	} else if typ == "leaf" {
		values = url.Values{
			"soil": {previousHealth[zoneId-1].Stem},
			"stem": {previousHealth[zoneId-1].Stem},
			"leaf": {msg},
		}
	}

	// Send new health status
	res, err = http.PostForm("http://dowav-api.herokuapp.com/api/health/upload/"+previousHealth[zoneId-1].Plant, values)
	if err != nil {
		log.Println(err)
	}
	res.Body.Close()
	lastStatusSent = time.Now().Unix()
}

// Determines whether sufficient time has passed in between sending
func shouldTimeout(lastTime int64) (b bool) {
	return time.Now().Unix()-lastTime < timeout
}
