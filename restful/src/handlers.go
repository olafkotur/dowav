package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
)

func getDocumentation(writer http.ResponseWriter, request *http.Request) {
	url := "https://documenter.getpostman.com/view/8555555/SWDzgMa6?version=latest"
	http.Redirect(writer, request, url, http.StatusSeeOther)
}

func uploadHistoricData(writer http.ResponseWriter, request *http.Request) {
	printRequest(request)

	// Get data from request
	_ = request.ParseForm()
	zone := toInt(request.Form.Get("zone"))
	startTime := toFloat(request.Form.Get("startTime"))
	endTime := toFloat(request.Form.Get("endTime"))
	temperature := toFloat(request.Form.Get("temperature"))
	moisture := toFloat(request.Form.Get("moisture"))
	light := toFloat(request.Form.Get("light"))

	if zone <= 0 {
		// TODO: Should send bad response
		return
	}

	// Insert values into db
	statement, err := database.Prepare("INSERT INTO historic (zoneId, startTime, endTime, temperature, moisture, light) VALUES (?, ?, ?, ?, ?, ?)")
	if err != nil {
		panic(err)
	}
	fmt.Println(zone, temperature, moisture, light)
	re, er := statement.Exec(zone, startTime, endTime, temperature, moisture, light)
	fmt.Println(re, er)

	res := Message{"Success"}
	sendResponse(res, writer)
}

// /api/historic/temperature?from=1573398000&to=1573398300
func getHistoricData(writer http.ResponseWriter, request *http.Request) {
	printRequest(request)
	// Safety in case no paramters are entered
	if !strings.Contains(request.URL.String(), "from=") || !strings.Contains(request.URL.String(), "to=") {
		// TODO: Add a bad request here
		return
	}

	// Get parameters from request
	from := request.URL.Query()["from"][0]
	to := request.URL.Query()["to"][0]
	sensor := getMuxVariable("sensor", request)

	var res [][]ReadingData
	for i := 0; i < 3; i++ {
		var hisData []ReadingData
		// Fetch from the db
		rows, err := database.Query("SELECT endTime, " + sensor + " FROM historic WHERE zoneId == " + toString(i+1) + " AND startTime >= " + from + " AND endTime <= " + to + " ORDER BY zoneId ASC")
		if err != nil {
			fmt.Println(err)
			http.Error(writer, "Database failed", http.StatusInternalServerError)
			return
		}

		var endTime float64
		var sensorData float64

		// Populate response from the db
		for rows.Next() {
			_ = rows.Scan(&endTime, &sensorData)
			hisData = append(hisData, ReadingData{endTime * 1000, sensorData})
		}
		res = append(res, hisData)
	}

	sendResponse(res, writer)
}

func getWaterHistoricData(writer http.ResponseWriter, request *http.Request) {
	printRequest(request)

	connTime := time.Now().Add(time.Duration(-24) * time.Hour).Unix()

	var res []WaterData
	rows, err := database.Query("SELECT * FROM water WHERE time > " + strconv.FormatInt(connTime, 10) + " ORDER BY time ASC")
	if err != nil {
		fmt.Println(err)
		http.Error(writer, "Database failed to execute", http.StatusInternalServerError)
		return
	}
	for rows.Next() {
		var waterData WaterData
		_ = rows.Scan(&waterData.Time, &waterData.Volume, &waterData.Tilt)
		res = append(res, waterData)
	}

	sendResponse(res, writer)
}

// TEST: curl -d "zone=1&temperature=26&moisture=220&light=98" localhost:8080/api/live/upload
func uploadLiveData(writer http.ResponseWriter, request *http.Request) {
	printRequest(request)
	// Get data from request
	_ = request.ParseForm()
	time := time.Now().Unix()
	zone := toInt(request.Form.Get("zone"))
	temperature := toInt(request.Form.Get("temperature"))
	moisture := toInt(request.Form.Get("moisture"))
	light := toInt(request.Form.Get("light"))

	if zone <= 0 {
		// TODO: Should send bad response
		return
	}

	statement, _ := database.Prepare("INSERT INTO live (zoneId, time, temperature, moisture, light) VALUES (?, ?, ?, ?, ?)")
	_, err := statement.Exec(zone, time, temperature, moisture, light)
	if err != nil {
		panic(err)
	}

	res := Message{"Success"}
	sendResponse(res, writer)
}

func getLiveData(writer http.ResponseWriter, request *http.Request) {
	printRequest(request)

	// Get parameters from request
	sensor := getMuxVariable("sensor", request)

	var res []ReadingData
	for i := 0; i < 3; i++ {
		// Get data from db
		var time float64
		var sensorValue float64
		rows, err := database.Query("SELECT time, " + sensor + " FROM live WHERE zoneId == " + toString(i+1) + " ORDER BY time DESC LIMIT 1")
		if err != nil {
			panic(err)
		}

		for rows.Next() {
			_ = rows.Scan(&time, &sensorValue)
		}
		rows.Close()

		// Format data
		data := ReadingData{time * 1000, sensorValue}
		res = append(res, data)
	}

	sendResponse(res, writer)
}

func uploadLocationData(writer http.ResponseWriter, request *http.Request) {
	// Get data from request
	_ = request.ParseForm()
	time := time.Now().Unix()
	zone := toInt(request.Form.Get("zone"))
	xCoordinate := toInt(request.Form.Get("xCoordinate"))
	yCoordinate := toInt(request.Form.Get("yCoordinate"))

	if zone < 0 {
		http.Error(writer, "Zone can't be less than 0", http.StatusBadRequest)
		return
	}

	statement, _ := database.Prepare("INSERT INTO location (zoneId, time, xCoordinate, yCoordinate) VALUES (?, ?, ?, ?)")
	_, err := statement.Exec(zone, time, xCoordinate, yCoordinate)
	if err != nil {
		panic(err)
	}

	res := Message{"Success"}
	sendResponse(res, writer)
	printRequest(request)
}

func getLocationData(writer http.ResponseWriter, request *http.Request) {
	// Get parameters from request
	dataType := getMuxVariable("type", request)

	var res interface{}

	// Fetch and return live data
	var live LocationData
	if dataType == "live" {
		// Scan db and save to var
		rows, _ := database.Query("SELECT * FROM location ORDER BY time DESC LIMIT 1")
		for rows.Next() {
			_ = rows.Scan(&live.ZoneId, &live.Time, &live.XCoordinate, &live.YCoordinate)
		}
		rows.Close()
		res = live
	}

	// Fetch and return historic data
	var historic []LocationData
	if dataType == "historic" {
		timeRange := int(time.Now().Add(-time.Duration(time.Hour * 24)).Unix())

		// Scan db and save to var
		rows, _ := database.Query("SELECT * FROM location WHERE time > " + toString(timeRange))
		for rows.Next() {
			var temp LocationData
			_ = rows.Scan(&temp.ZoneId, &temp.Time, &temp.XCoordinate, &temp.YCoordinate)
			historic = append(historic, temp)
		}
		rows.Close()
		res = historic
	}

	sendResponse(res, writer)
	printRequest(request)
}

func postTweet(writer http.ResponseWriter, request *http.Request) {
	_ = request.ParseForm()
	msg := request.Form.Get("message")
	if msg == "" {
		return
	}

	config := oauth1.NewConfig("MThFJvVlV5zgpM52v0v9WriM6", "gv4ypIp5G5QaxsGVAXNVxJSRrwb5ednzumk3fWD2917fO9B5WM")
	token := oauth1.NewToken("1196375364907470848-3VNKCnMblHl306D20PW3jJTwq6ZXOn", "Tm0hFLXmusLKCXwnlJi4w7QTIQdzNTKeehEi5wBaI7pDV")
	httpClient := config.Client(oauth1.NoContext, token)
	client := twitter.NewClient(httpClient)

	id := rand.Intn(5000)
	msg = msg + " #T" + toString(id)

	_, res, err := client.Statuses.Update(msg, nil)
	if err != nil {
		log.Println(err)
	}
	res.Body.Close()

	printRequest(request)
	sendResponse(res, writer)
}

func getTweets(writer http.ResponseWriter, request *http.Request) {
	config := oauth1.NewConfig("MThFJvVlV5zgpM52v0v9WriM6", "gv4ypIp5G5QaxsGVAXNVxJSRrwb5ednzumk3fWD2917fO9B5WM")
	token := oauth1.NewToken("1196375364907470848-3VNKCnMblHl306D20PW3jJTwq6ZXOn", "Tm0hFLXmusLKCXwnlJi4w7QTIQdzNTKeehEi5wBaI7pDV")
	httpClient := config.Client(oauth1.NoContext, token)
	client := twitter.NewClient(httpClient)

	list, res, err := client.Timelines.UserTimeline(&twitter.UserTimelineParams{UserID: 1196375364907470848})
	if err != nil {
		log.Println(err)
	}
	res.Body.Close()

	printRequest(request)
	sendResponse(list, writer)
}

func postQuestionTweet(writer http.ResponseWriter, request *http.Request) {
	_ = request.ParseForm()
	msg := request.Form.Get("message")
	if msg == "" {
		http.Error(writer, "Please provide message", http.StatusBadRequest)
		return
	}

	result, err, code := getMessageTweet(msg)
	if err != nil {
		http.Error(writer, err.Error(), code)
		return
	}

	config := oauth1.NewConfig("MThFJvVlV5zgpM52v0v9WriM6", "gv4ypIp5G5QaxsGVAXNVxJSRrwb5ednzumk3fWD2917fO9B5WM")
	token := oauth1.NewToken("1196375364907470848-3VNKCnMblHl306D20PW3jJTwq6ZXOn", "Tm0hFLXmusLKCXwnlJi4w7QTIQdzNTKeehEi5wBaI7pDV")
	httpClient := config.Client(oauth1.NoContext, token)
	client := twitter.NewClient(httpClient)

	_, res, err := client.Statuses.Update(result, nil)
	if err != nil {
		log.Println(err)
	}
	res.Body.Close()
	_, _ = writer.Write([]byte("Success"))
}

func getAllNotifications(w http.ResponseWriter, r *http.Request) {
	printRequest(r)

	var res []Notification

	rows, err := database.Query("SELECT * FROM notification")
	if err != nil {
		http.Error(w, "Database query failed.", http.StatusInternalServerError)
	}
	for rows.Next() {
		var notification Notification
		_ = rows.Scan(&notification.Time, &notification.Message, &notification.Type)
		res = append(res, notification)
	}
	rows.Close()

	sendResponse(res, w)
}

func getNotificationsWs(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get a request")
	ch, errCh := upgrader.Upgrade(w, r, nil)

	if errCh != nil {
		fmt.Println("Upgrader error: " + errCh.Error())
		return
	}

	connTime := time.Now()

	defer ch.Close()

	for {
		rows, err := database.Query("SELECT * FROM notification WHERE time > " + toString(int(connTime.Unix())) + " ORDER BY time DESC LIMIT 1")
		if err != nil {
			fmt.Println("Database error:", err)
			ch.Close()
		}

		var notification Notification

		for rows.Next() {
			_ = rows.Scan(&notification.Time, &notification.Message, &notification.Type)
		}
		rows.Close()

		if notification.Time != 0 && notification.Message != "" && notification.Type != "" {
			notification.Time *= 1000
			err = ch.WriteJSON(notification)
			if err != nil {
				log.Println("write:", err)
				break
			}
			connTime = time.Now()
		}

		time.Sleep(2 * time.Second)
	}
}

func pushNotification(w http.ResponseWriter, r *http.Request) {
	_ = r.ParseForm()
	time := time.Now().Unix()
	message := r.Form.Get("message")
	messageType := r.Form.Get("type")

	if message == "" {
		http.Error(w, "Provide a message field in a form", http.StatusBadRequest)
		return
	}

	statement, _ := database.Prepare("INSERT INTO notification (time, message, messageType) VALUES (?, ?, ?)")
	_, err := statement.Exec(time, message, messageType)
	if err != nil {
		http.Error(w, "Database failed to execute command", http.StatusInternalServerError)
		return
	}

	res := Message{"Success"}
	sendResponse(res, w)
	printRequest(r)
}

func uploadWaterData(writer http.ResponseWriter, request *http.Request) {
	printRequest(request)
	_ = request.ParseForm()
	now := time.Now().Unix()
	volume := request.Form.Get("volume")
	tilt := request.Form.Get("tilt")

	statement, _ := database.Prepare("INSERT INTO water (time, volume, tilt) VALUES (?, ?, ?)")
	_, err := statement.Exec(now, volume, tilt)
	if err != nil {
		http.Error(writer, "Database failed to execute command", http.StatusInternalServerError)
		return
	}

	sendResponse(Message{"Success"}, writer)
}

func getWaterWs(writer http.ResponseWriter, request *http.Request) {
	ch, errCh := upgrader.Upgrade(writer, request, nil)

	if errCh != nil {
		fmt.Println("Upgrader error: " + errCh.Error())
		return
	}
	defer ch.Close()

	for {
		rows, err := database.Query("SELECT * FROM water ORDER BY time DESC LIMIT 1")
		if err != nil {
			fmt.Println("Database error")
			ch.Close()
		}

		var water WaterData

		for rows.Next() {
			_ = rows.Scan(&water.Time, &water.Volume, &water.Tilt)
		}
		rows.Close()

		if water.Time != 0 {
			water.Time *= 1000
			err = ch.WriteJSON(water)
			if err != nil {
				log.Println("write:", err)
				break
			}
		}

		time.Sleep(500 * time.Millisecond)
	}
	res := Message{"Success"}
	sendResponse(res, writer)
	printRequest(request)
}

func setPlantSetting(writer http.ResponseWriter, request *http.Request) {
	printRequest(request)

	connTime := time.Now().Unix()
	decoder := json.NewDecoder(request.Body)
	var s []PlantSettings
	err := decoder.Decode(&s)
	if err != nil {
		fmt.Println(err)
		http.Error(writer, "Can't parse JSON", http.StatusBadRequest)
		return
	}

	zones, zoneErr := queryAllZones()
	if zoneErr != nil {
		http.Error(writer, zoneErr.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println(zones)

	for _, p := range s {
		if p.Zone != nil {
			if *p.Zone > int64(len(*zones)) || *p.Zone < 0 {
				http.Error(writer, "There is no such zone.", http.StatusBadRequest)
				return
			}
		}
	}

	statement, statementError := database.Prepare("Update plant SET shouldSendTweets=?, minTemperature=?, maxTemperature=?, minLight=?, maxLight=?, minMoisture=?, bulbColor=?, bulbBrightness=?, lastUpdate=? WHERE plant=?")
	updateStatement, updateStatError := database.Prepare("UPDATE zone SET plant=(SELECT id FROM plant WHERE plant=?) WHERE id=?")
	if statementError != nil || updateStatError != nil {
		fmt.Println(statementError)
		http.Error(writer, "Database statement Error", http.StatusInternalServerError)
		return
	}

	for _, plant := range s {
		var plantName = plant.Plant
		_, err := statement.Exec(&plant.ShouldSendTweets, &plant.MinTemperature, &plant.MaxTemperature, &plant.MinLight, &plant.MaxLight, &plant.MinMoisture, &plant.BulbColor, &plant.BulbBrightness, &connTime, plantName)
		if err != nil {
			fmt.Println(err)
			http.Error(writer, "Database can't execute statement", http.StatusInternalServerError)
			return
		}
		fmt.Println(*plant.Zone)
		if *plant.Zone == 0 {
			_, err := database.Exec("UPDATE zone SET plant=NULL WHERE plant=(SELECT id FROM plant WHERE plant='" + plantName + "')")
			fmt.Println(err)
		} else if plant.Zone != nil {
			_, err := updateStatement.Exec(plantName, plant.Zone)
			if err != nil {
				fmt.Println(err)
				http.Error(writer, "Database can't execute statement", http.StatusInternalServerError)
				return
			}
		}
	}

	res := Message{"Successfully changed row."}
	sendResponse(res, writer)
}

func getPlantSettingWs(writer http.ResponseWriter, request *http.Request) {
	ch, errCh := upgrader.Upgrade(writer, request, nil)

	if errCh != nil {
		fmt.Println("Upgrader error: " + errCh.Error())
		return
	}
	connTime := time.Now().Unix()
	timeStr := strconv.Itoa(int(connTime))
	defer ch.Close()

	for {
		var res []PlantSettings
		rows, e := database.Query("SELECT zone.id, plant.plant, shouldSendTweets, minTemperature, maxTemperature, minLight,maxLight, minMoisture, bulbColor, bulbBrightness, lastUpdate FROM zone LEFT JOIN plant on zone.plant=plant.id WHERE lastUpdate > " + timeStr)
		if e != nil {
			fmt.Println(e)
		}
		for rows.Next() {
			var plantSettings PlantSettings
			var zone sql.NullInt64

			err := rows.Scan(&zone, &plantSettings.Plant, &plantSettings.ShouldSendTweets, &plantSettings.MinTemperature, &plantSettings.MaxTemperature, &plantSettings.MinLight, &plantSettings.MaxLight, &plantSettings.MinMoisture, &plantSettings.BulbColor, &plantSettings.BulbBrightness, &plantSettings.LastUpdate)
			fmt.Println(res)
			if err != nil {
				fmt.Println(err)
				ch.Close()
			}
			if zone.Valid {
				plantSettings.Zone = &zone.Int64
			}
			res = append(res, plantSettings)
		}
		rows.Close()
		if len(res) > 0 {
			err := ch.WriteJSON(res)
			if err != nil {
				log.Println("write:", err)
				break
			}
			connTime = time.Now().Unix()
			timeStr = strconv.Itoa(int(connTime))
		}

		time.Sleep(2 * time.Second)
	}
}

func getAllPlantsSettings(writer http.ResponseWriter, request *http.Request) {
	printRequest(request)

	res, err := queryAllPlantsSettings()
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	sendResponse(*res, writer)
}

func createPlantSetting(writer http.ResponseWriter, request *http.Request) {
	printRequest(request)

	connTime := time.Now().Unix()
	decoder := json.NewDecoder(request.Body)
	var s PlantSettings
	err := decoder.Decode(&s)
	if err != nil {
		fmt.Println(err)
		http.Error(writer, "Can't parse JSON", http.StatusBadRequest)
		return
	}

	statement, err := database.Prepare("INSERT INTO plant(plant, shouldSendTweets, minTemperature, maxTemperature, minLight, maxLight, minMoisture, lastUpdate) VALUES (?,?,?,?,?,?,?,?)")
	if err != nil {
		fmt.Println(err)
		http.Error(writer, "Can't prepare statement", http.StatusInternalServerError)
		return
	}
	_, err = statement.Exec(s.Plant, &s.ShouldSendTweets, &s.MinTemperature, &s.MaxTemperature, &s.MinLight, &s.MaxLight, &s.MinMoisture, connTime)
	if err != nil {
		fmt.Println(err)
		http.Error(writer, "Can't Execute SQL", http.StatusInternalServerError)
		return
	}
	sendResponse(Message{"Success"}, writer)
}

func deletePlantSetting(writer http.ResponseWriter, request *http.Request) {
	printRequest(request)

	plantName := getMuxVariable("plantName", request)

	statement, err := database.Prepare("DELETE FROM plant WHERE plant=?")
	if err != nil {
		fmt.Println(err)
		http.Error(writer, "Can't prepare statement", http.StatusInternalServerError)
		return
	}
	res, err := statement.Exec(&plantName)
	if err != nil {
		fmt.Println(err)
		http.Error(writer, "Can't Execute SQL", http.StatusInternalServerError)
		return
	}
	if rows, _ := res.RowsAffected(); rows == 1 {
		sendResponse(Message{"Success"}, writer)
	} else {
		http.Error(writer, "There is no "+plantName+" plant.", http.StatusBadRequest)
	}
}

func updatePlantHealth(writer http.ResponseWriter, request *http.Request) {
	printRequest(request)

	// Get data from request
	_ = request.ParseForm()
	plant := getMuxVariable("plant", request)
	now := time.Now().Unix()
	soil := request.Form.Get("soil")
	stem := request.Form.Get("stem")
	leaf := request.Form.Get("leaf")

	// Update database
	statement, err := database.Prepare("UPDATE health SET time=?, soil=?, stem=?, leaf=? WHERE plant=?")
	if err != nil {
		http.Error(writer, "Database failed", http.StatusInternalServerError)
		return
	}
	_, err = statement.Exec(now, soil, stem, leaf, plant)
	if err != nil {
		http.Error(writer, "Can't Execute SQL", http.StatusInternalServerError)
		return
	}

	sendResponse(Message{"Success"}, writer)
}

func getPlantHealth(writer http.ResponseWriter, request *http.Request) {
	printRequest(request)

	// Fetch data from database
	rows, err := database.Query("SELECT * FROM health")
	if err != nil {
		panic(err)
	}

	// Format data
	var res []HealthData
	for rows.Next() {
		var data HealthData
		_ = rows.Scan(&data.Id, &data.Plant, &data.Time, &data.Soil, &data.Stem, &data.Leaf)
		res = append(res, data)
	}
	rows.Close()

	sendResponse(res, writer)
}
