package main

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"strings"

	"github.com/lucasb-eyer/go-colorful"
	"github.com/tidwall/gjson"
)

func createHueId(url string) (userid string, status bool) {
	type Payload struct {
		Devicetype string
	}

	data := Payload{"dowav"}

	payloadBytes, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
		return "", false
	}
	body := bytes.NewReader(payloadBytes)

	req, err := http.NewRequest("POST", "http://"+url+"/api", body)
	if err != nil {
		log.Println(err)
		return "", false
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Println(err)
		return "", false
	}
	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		return "", false
	}

	respM := string(respBody[1 : len(respBody)-1])
	value := gjson.Get(respM, "success.username")
	id := value.String()
	if len(id) == 0 {
		log.Println("Please push the button of bridge and connection again")
		return "", false
	}
	return id, true

}

func getBulbs(id, url string, numBulb int) (bulbs string) {
	var bulbType []string
	resp, err := http.Get("http://localhost:8000/api/" + id + "/lights")
	if err != nil {
		return
	}
	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		return
	}

	respM := string(respBody)
	resp.Body.Close()
	for i := 1; i < numBulb+1; i++ {
		value := gjson.Get(respM, toString(i)+".type")
		bType := strings.ToLower(value.String())

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

func toggleLight(id, url string, state bool, bulbNum int) (status bool) {
	type Payload struct {
		On bool `json:"on"`
	}

	data := Payload{state}
	payloadBytes, err := json.Marshal(data)
	if err != nil {
		return false
	}
	body := bytes.NewReader(payloadBytes)

	req, err := http.NewRequest("PUT", "http://"+url+"/api/"+id+"/lights/"+toString(bulbNum)+"/state", body)
	if err != nil {
		return false
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return false
	}
	resp.Body.Close()
	return true
}

func changeBrightness(id, url string, bulbNum, brightness int) (status bool) {

	type Payload struct {
		On  bool `json:"on"`  //true , false
		Bri int  `json:"bri"` //0-254
	}

	data := Payload{true, brightness}
	payloadBytes, err := json.Marshal(data)
	if err != nil {
		return false
	}
	body := bytes.NewReader(payloadBytes)

	req, err := http.NewRequest("PUT", "http://"+url+"/api/"+id+"/groups/"+toString(bulbNum)+"/state", body)
	if err != nil {
		return false
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return false
	}
	resp.Body.Close()
	return true
}

func changeColor(id, url, hex string, bulbNum int) (status bool) {
	h, s, v := hexToHsv(hex)
	h = (h / 360) * 65535 // hue
	s = s * 255           //saturation
	v = v * 254           //bright
	r, g, b := hexToRGB(hex)

	type Payload struct {
		On  bool      `json:"on"`
		Bri int       `json:"bri"`
		Xy  []float64 `json:"xy"`
		Hue int       `json:"hue"`
		Sat int       `json:"sat"`
	}

	xy := getXY(r, g, b)
	data := Payload{true, int(v), xy, int(h), int(s)}
	payloadBytes, err := json.Marshal(data)
	if err != nil {
		return false
	}
	body := bytes.NewReader(payloadBytes)

	req, err := http.NewRequest("PUT", "http://"+url+"/api/"+id+"/lights/"+toString(bulbNum)+"/state", body)
	if err != nil {
		return false
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return false
	}
	resp.Body.Close()
	return true
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
