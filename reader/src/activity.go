package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/rgamba/evtwebsocket"
)

var shouldSendTweets bool
var previousTweet string
var previousNotification string

var zoneSettings []ZoneSetting

func listenUserSettings() {
	conn := evtwebsocket.Conn{
		OnMessage: func(msg []byte, w *evtwebsocket.Conn) {
			var settings []ZoneSetting
			_ = json.Unmarshal(msg, &settings)
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

	for _, setting := range zoneSettings {
		if setting.Zone == 0 {
			continue
		}

		// Temperature
		if data.Temperature.Value <= setting.MinTemperature {
			msg = "The temperature seems to be below the recommend value in zone " + toString(data.Zone) + " #warning #low #temperature"
		} else if data.Temperature.Value >= setting.MaxTemperature {
			msg = "The temperature seems to be above the recommend value in zone " + toString(data.Zone) + " #warning #high #temperature"
		}

		// Moisture
		if data.Moisture.Value <= setting.MinMoisture {
			msg = "The moisture level seems to be below the recommend value in zone " + toString(data.Zone) + " #warning #low #moisture"
		}

		// Light
		if data.Light.Value <= setting.MinLight {
			msg = "The light level seems to be below the recommend value in zone " + toString(data.Zone) + " #warning #low #light"

		} else if data.Light.Value >= setting.MaxLight {
			msg = "The light level seems to be above the recommend value in zone " + toString(data.Zone) + " #warning #high #light"
		}

		// Send tweet and notification
		if msg != "" {
			postTweet(msg)
			pushNotification(msg, "info")
		}
	}
}

func analyseLocationData(d []byte) {
	var data Location
	_ = json.Unmarshal(d, &data)

	if data.Zone != 0 && previousLocation != 0 {
		msg := "A user has entered the green house and is now in zone " + toString(data.Zone) + " #wearefamily"
		postTweet(msg)
		pushNotification(msg, "success")
	}
}

func analyseWaterData(d []byte) {
	var data Water
	_ = json.Unmarshal(d, &data)

	if data.Depth <= 0 {
		msg := "The watering can has ran out of water! #warning #low #water"
		postTweet(msg)
		pushNotification(msg, "info")
	}
}

func postTweet(msg string) {
	if msg == previousTweet || !shouldSendTweets {
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
}
