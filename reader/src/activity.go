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

var previousTweet string
var previousNotification string

func listenUserSettings() {
	conn := evtwebsocket.Conn{
		OnConnected: func(w *evtwebsocket.Conn) {
			fmt.Println("Connected user setting websocket")
		},
		OnMessage: func(msg []byte, w *evtwebsocket.Conn) {
			fmt.Println("Received new user setting:", msg)
		},
		OnError: func(err error) {
			fmt.Println(err.Error())
		},
	}
	err := conn.Dial("ws://localhost:8080/api/setting", "GET")
	if err != nil {
		log.Println(err)
	}
}

func checkEnvironmentTweet(d []byte) {
	var data Environment
	var msg string
	_ = json.Unmarshal(d, &data)

	// Temperature
	if data.Temperature.Value <= 18 {
		msg = "The temperature seems to be below the recommend value in zone " + toString(data.Zone) + " #warning #low #temperature"
	} else if data.Temperature.Value >= 35 {
		msg = "The temperature seems to be above the recommend value in zone " + toString(data.Zone) + " #warning #high #temperature"
	}

	// Moisture
	if data.Moisture.Value <= 50 {
		msg = "The moisture level seems to be below the recommend value in zone " + toString(data.Zone) + " #warning #low #moisture"
	}

	// Light
	if data.Light.Value <= 20 {
		msg = "The light level seems to be below the recommend value in zone " + toString(data.Zone) + " #warning #low #light"

	} else if data.Light.Value >= 225 {
		msg = "The light level seems to be above the recommend value in zone " + toString(data.Zone) + " #warning #high #light"
	}

	// Send tweet and notification
	if msg != "" {
		postTweet(msg)
		pushNotification(msg, "info")
	}
}

func checkLocationTweet(d []byte) {
	var data Location
	_ = json.Unmarshal(d, &data)

	if data.Zone != 0 && previousLocation != 0 {
		msg := "A user has entered the green house and is now in zone " + toString(data.Zone) + " #wearefamily"
		postTweet(msg)
		pushNotification(msg, "success")
	}
}

func checkWaterTweet(d []byte) {
	var data Water
	_ = json.Unmarshal(d, &data)

	if data.Depth <= 0 {
		msg := "The watering can has ran out of water! #warning #low #water"
		postTweet(msg)
		pushNotification(msg, "info")
	}
}

func postTweet(msg string) {
	if msg == previousTweet {
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
