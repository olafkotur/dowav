package main

import (
	"bytes"
	"encoding/json"
	"github.com/lucasb-eyer/go-colorful"
	"github.com/tidwall/gjson"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"strconv"
	"strings"
)

//go get -u github.com/tidwall/gjson

func makeID(ipPort string) (userid string) {
	//curl -d '{"devicetype":"Pythones"}' -H "Content-Type: application/json" -X POST 'http://localhost:8000/api'
	type Payload struct {
		Devicetype string //`json:"devicetype"`
	}

	data := Payload{"pythones"}

	payloadBytes, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
		// handle err
	}
	body := bytes.NewReader(payloadBytes)

	req, err := http.NewRequest("POST", "http://"+ipPort+"/api", body)
	if err != nil {
		log.Println(err)
		// handle err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Println(err)
		// handle err
	}
	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		//  handle err
	}

	respM := string(respBody[1 : len(respBody)-1])
	//log.Println(respM)
	value := gjson.Get(respM, "success.username")
	id := value.String()
	if len(id) == 0 {
		log.Println("please push the button of bridge")
	}
	return id

}

func getBulbs(id, iport string, numBulb int) (bulbs string) {
	//curl 'http://<BRIDGE_IP>/api/<YOUR_USERNAME>/lights
	var bulbType []string
	resp, err := http.Get("http://localhost:8000/api/" + id + "/lights")
	if err != nil {
		// handle err
	}
	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		//  handle err
	}

	respM := string(respBody)
	log.Println(respM)
	defer resp.Body.Close()
	for i := 1; i < numBulb+1; i++ {
		value := gjson.Get(respM, toString(i)+".type")
		bType := strings.ToLower(value.String())

		log.Println(bType)
		switch bType {
		case "on/off light":
			bulbType = append(bulbType, "none")
		case "on/off plug-in unit":
			bulbType = append(bulbType, "none")
		case "dimmable light":
			bulbType = append(bulbType, "onlyDim")
		case "dimmable plug-in unit":
			bulbType = append(bulbType, "onlyDim")
		case "colour light":
			bulbType = append(bulbType, "onlyCol")
		case "color light":
			bulbType = append(bulbType, "onlyCol")
		case "extended color light":
			bulbType = append(bulbType, "both")
		case "extended colour light":
			bulbType = append(bulbType, "both")
		case "color temperature light":
			log.Println("c")
		case "colour temperature light":
			log.Println("c")
		}
	}
	return respM
}

func OnOFFLight(id, ipPort string, state bool, bulbNum int) {
	//curl -X PUT -H 'Content-Type: application/json' -d '{"on":true}' 'http://<127.0.0.1:8000>/api/<Pythones>/lights/<YOUR_LIGHT_ID>/state'

	type Payload struct {
		On bool `json:"on"`
	}

	data := Payload{state}
	payloadBytes, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
		// handle err
	}
	body := bytes.NewReader(payloadBytes)

	req, err := http.NewRequest("PUT", "http://"+ipPort+"/api/"+id+"/lights/"+toString(bulbNum)+"/state", body)
	if err != nil {
		// handle err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		// handle err
	}

	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		//  handle err
	}

	respM := string(respBody)
	log.Println(respM)

	defer resp.Body.Close()
}

func changeBright(id, ipPort string, bulbNum, brightness int) {

	type Payload struct {
		On  bool `json:"on"`  //true , false
		Bri int  `json:"bri"` //0-254
	}

	data := Payload{true, brightness}
	payloadBytes, err := json.Marshal(data)
	if err != nil {
		// handle err
	}
	body := bytes.NewReader(payloadBytes)

	req, err := http.NewRequest("PUT", "http://"+ipPort+"/api/"+id+"/groups/"+toString(bulbNum)+"/state", body)
	if err != nil {
		// handle err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		// handle err
	}
	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		//  handle err
	}
	respM := string(respBody)
	log.Println(respM)
	defer resp.Body.Close()
}

//func changeColour(id, ipPort string, bulbNum int, red, green, blue float64) {
func changeColour(id, ipPort, hex string, bulbNum int) {
	h, s, v := hexToHsv(hex)
	h = (h / 360) * 65535 // hue
	s = s * 255           //saturation
	v = v * 254           //bright
	r, g, b := hexToRGB(hex)

	//curl -X PUT -H 'Content-Type: application/json' -d '{"on":true, "bri":10, "xy":[0.1691,0.0441]}' 'http://<BRIDGE_IP>/api/<YOUR_USERNAME>/groups/<YOUR_GROUP_ID>/action'
	//curl -X PUT -H 'Content-Type: application/json' -d '{"on":true, "bri":10, "xy":[0.7,0.3]}' 'http://<BRIDGE_IP>/api/<YOUR_USERNAME>/lights/<YOUR_LIGHT_ID>/state'

	type Payload struct {
		On  bool `json:"on"`  //true , false
		Bri int  `json:"bri"` //0-254
		//Ct  int       `json:"ct"`  //
		Xy  []float64 `json:"xy"` //
		Hue int       `json:"hue"`
		Sat int       `json:"sat"`
	}

	//xy := []float64{0.115, 0.826}
	xy := getXY(r, g, b)
	//hue := getHue(red, green, blue)
	//data := Payload{true, 254, cM, xy, hM, 255} //(hue * 255), }
	data := Payload{true, int(v), xy, int(h), int(s)} //(hue * 255), }
	payloadBytes, err := json.Marshal(data)
	if err != nil {
		// handle err
	}
	body := bytes.NewReader(payloadBytes)

	req, err := http.NewRequest("PUT", "http://"+ipPort+"/api/"+id+"/lights/"+toString(bulbNum)+"/state", body)
	if err != nil {
		// handle err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		// handle err
	}
	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		//  handle err
	}
	respM := string(respBody)
	log.Println(respM)
	defer resp.Body.Close()
}

//func makeGroup()

func main() {
	ipPort := "localhost:8000"                     //ip:port
	preUserID := "7a240054317c6ec2c261ec818423c3c" //it should be changed when using different bridge
	userID := makeID(ipPort)
	if len(userID) == 0 {
		log.Println("bridge button is not pressed using pre set ID")
		userID = preUserID
	}

	getBulbs(userID, ipPort, 3)                //3 for future functionality
	OnOFFLight(userID, ipPort, true, 1)        //true : on, false : off
	changeBright(userID, ipPort, 254, 1)       //can't change brightness while off
	changeColour(userID, ipPort, "#513143", 5) //can't change colour while off
}

func toString(i int) (s string) {
	return strconv.Itoa(i)
}

/*
 * Author u/Croques
 * Jun 07 2016
 * Using RGB colours with Philips Hue bulbs
 * Available at : https://www.reddit.com/r/tasker/comments/4mzd01/using_rgb_colours_with_philips_hue_bulbs/
 * Modified function from javascript code to Golang and values
 */
func getXY(red, green, blue float64) (xy []float64) {

	if red > 0.04045 {
		red = math.Pow(((red/255)+0.055)/(1.0+0.055), 2.4)
	} else {
		red = ((red / 255) / 12.92)
	}

	if green > 0.04045 {
		green = math.Pow(((green/255)+0.055)/(1.0+0.055), 2.4)
	} else {
		green = ((green / 255) / 12.92)
	}
	if blue > 0.04045 {
		blue = math.Pow(((blue/255)+0.055)/(1.0+0.055), 2.4)
	} else {
		blue = ((blue / 255) / 12.92)
	}
	//X := red*0.664511 + green*0.154324 + blue*0.162028
	X := red*0.649926 + green*0.103455 + blue*0.197109
	Y := red*0.234327 + green*0.743075 + blue*0.022598
	Z := red*0.000000 + green*0.053077 + blue*1.035763
	x := X / (X + Y + Z)
	y := Y / (X + Y + Z)
	return []float64{toFixed(x, 4), toFixed(y, 4)}

}

func toFixed(num float64, precision int) float64 {
	output := math.Pow(10, float64(precision))
	return float64(math.Round(num*output)) / output
}

func hexToHsv(hex string) (hf, sf, vf float64) {
	c, err := colorful.Hex(hex) //"#517AB8"
	if err != nil {
		log.Println(err)
	}
	h, s, v := c.Hsv()
	return h, s, v
}

func hexToRGB(hex string) (r, g, b float64) {
	c, err := colorful.Hex(hex) //"#517AB8"
	if err != nil {
		log.Println(err)
	}
	return c.R * 255, c.G * 255, c.B * 255
}
