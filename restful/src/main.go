package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	_ "github.com/mattn/go-sqlite3"
)

var database *sql.DB
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Database setup
	database, _ = sql.Open("sqlite3", "./database.db?_foreign_keys=on")
	createTables()
	setDefaultValues()

	// Server routing
	router := mux.NewRouter().StrictSlash(true)

	// Historic handlers
	router.HandleFunc("/api/historic/upload", uploadHistoricData).Methods("POST")
	router.HandleFunc("/api/historic/{sensor}", getHistoricData).Methods("GET")

	// Live handlers
	router.HandleFunc("/api/live/upload", uploadLiveData).Methods("POST")
	router.HandleFunc("/api/live/{sensor}", getLiveData).Methods("GET")
	router.HandleFunc("/api/location/upload", uploadLocationData).Methods("POST")
	router.HandleFunc("/api/location/{type}", getLocationData).Methods("GET")
	router.HandleFunc("/api/water/upload", uploadWaterData).Methods("POST")
	router.HandleFunc("/api/water", getWaterWs).Methods("GET")

	// Notification handlers
	router.HandleFunc("/api/tweet", postTweet).Methods("POST")
	router.HandleFunc("/api/tweets", getTweets).Methods("GET")
	router.HandleFunc("/api/tweet/question", postQuestionTweet).Methods("POST")
	router.HandleFunc("/api/notifications", getNotificationsWs).Methods("GET")
	router.HandleFunc("/api/notification", pushNotification).Methods("POST")

	// Setting handlers
	router.HandleFunc("/api/setting", setPlantSetting).Methods("POST")
	router.HandleFunc("/api/setting/delete/{plantName}", deletePlantSetting).Methods("GET")
	router.HandleFunc("/api/setting/create", createPlantSetting).Methods("POST")
	router.HandleFunc("/api/setting", getPlantSettingWs).Methods("GET")
	router.HandleFunc("/api/setting/all", getAllPlantsSettings).Methods("GET")

	// Plant handlers
	router.HandleFunc("/api/health/upload/{plant}", updatePlantHealth).Methods("POST")
	router.HandleFunc("/api/health", getPlantHealth).Methods("GET")

	// Misc handlers
	router.HandleFunc("/api/docs", getDocumentation).Methods("GET")

	log.Printf("Serving restful api on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

func setDefaultValues() {
	// Clear the table from previous settings
	_, _ = database.Exec("DELETE FROM zone")
	statement, _ := database.Prepare("DELETE FROM plant")
	_, _ = statement.Exec()

	plants := []string{"Tomatoes", "Staff", "Cucumbers"}
	values := []interface{}{"true", 18, 50, 20, 35, 225, "#fff", 254}
	time := time.Now().Unix()

	// Set each user setting
	statement, _ = database.Prepare("INSERT INTO plant (plant, shouldSendTweets, minTemperature, minMoisture, minLight, maxTemperature, maxLight, bulbColor, bulbBrightness, lastUpdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
	healthStatement, _ := database.Prepare("INSERT INTO health (plant, time, soil, stem, leaf) VALUES (?, ?, ?, ?, ?)")
	for i := range plants {
		r, rErr := statement.Exec(plants[i], values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], time)
		if rErr != nil {
			fmt.Println(rErr)
		}
		id, idErr := r.LastInsertId()
		if idErr != nil {
			fmt.Println(idErr)
		}
		st, stErr := database.Prepare("INSERT INTO zone(id,plant) VALUES (?, ?)")
		if stErr != nil {
			fmt.Println(stErr)
		}
		_, _ = st.Exec(i+1, id)

		_, err := healthStatement.Exec(plants[i], time, "", "", "")
		if err != nil {
			fmt.Println(err)
		}
	}
}

func printRequest(request *http.Request) {
	log.Printf("Method: %s\n", request.Method)
	log.Printf("URL: %s\n\n", request.URL)
}

func sendResponse(res interface{}, writer http.ResponseWriter) {
	response, _ := json.Marshal(res)
	writer.Header().Set("Content-Type", "application/json")
	writer.Header().Set("Access-Control-Allow-Origin", "*")
	writer.Header().Set("Access-Control-Allow-Methods", "POST, GET")
	writer.Header().Set("Access-Control-Max-Age", "2592000")
	_, err := writer.Write(response)
	if err != nil {
		panic(err)
	}
}

func createTables() {
	// Create plant table in database
	_, _ = database.Exec("DROP TABLE plant")
	statement, _ := database.Prepare("CREATE TABLE IF NOT EXISTS plant (id INTEGER PRIMARY KEY AUTOINCREMENT, plant TEXT UNIQUE, shouldSendTweets BOOLEAN, minTemperature INTEGER, minMoisture INTEGER, minLight INTEGER, maxTemperature INTEGER, maxLight INTEGER, bulbColor TEXT, bulbBrightness INTEGER, lastUpdate REAL)")
	_, err := statement.Exec()
	if err != nil {
		panic(err)
	}

	// Create zones table in database
	_, _ = database.Exec("DROP TABLE zone")
	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS zone (id INTEGER PRIMARY KEY, plant INTEGER REFERENCES plant(id) ON DELETE SET NULL)")
	_, err = statement.Exec()
	if err != nil {
		panic(err)
	}

	// Create historic table in database
	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS historic (zoneId INTEGER REFERENCES zone(id), startTime REAL, endTime REAL, temperature REAL, moisture REAL, light REAL)")
	_, err = statement.Exec()
	if err != nil {
		panic(err)
	}

	// Create live table in database
	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS live (zoneId INTEGER REFERENCES zone(id), time REAL, temperature INTEGER, moisture INTEGER, light INTEGER)")
	_, err = statement.Exec()
	if err != nil {
		panic(err)
	}

	// Create location table in database
	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS location (time REAL, zoneId INTEGER REFERENCES zone(id))")
	_, err = statement.Exec()
	if err != nil {
		panic(err)
	}

	// Create notification table in database
	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS notification (time REAL, message TEXT, messageType TEXT)")
	_, err = statement.Exec()
	if err != nil {
		panic(err)
	}

	// Create water table in database
	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS water (time REAL, volume INT, tilt INT)")
	_, err = statement.Exec()
	if err != nil {
		panic(err)
	}

	// Create setting table in database
	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS settings (time REAL, type TEXT, value TEXT)")
	_, err = statement.Exec()
	if err != nil {
		panic(err)
	}

	// Create health table in database
	_, _ = database.Exec("DROP TABLE health")
	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS health (plant TEXT PRIMARY KEY, time REAL, soil TEXT, stem TEXT, leaf TEXT)")
	_, err = statement.Exec()
	if err != nil {
		panic(err)
	}
}

func getMuxVariable(target string, request *http.Request) (v string) {
	return mux.Vars(request)[target]
}

func toInt(s string) (i int) {
	res, _ := strconv.Atoi(s)
	return res
}

func toFloat(s string) (f float64) {
	res, _ := strconv.ParseFloat(s, 64)
	return res
}

func toString(i int) (s string) {
	return strconv.Itoa(i)
}
