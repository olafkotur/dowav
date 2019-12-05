package main

import (
	"reflect"
	"testing"
)

func TestCreateHueId(t *testing.T) {
	id, _ := createHueId("localhost:8000")
	if len(id) == 0 {
		t.Error("Expected to get user Id but it can't")
	}
}

func TestGetBulbs(t *testing.T) {
	bulb := getBulbs("newdeveloper", "localhost:8000", 1)
	if len(bulb) == 0 {
		t.Error("Expected to get bulbs but it can't")
	}
}

func TestToggleLight(t *testing.T) {
	status := toggleLight("newdeveloper", "localhost:8000", true, 1)
	if !status {
		t.Error("Expected to turn on light but it can't")
	}
}
func TestToggleLightLux(t *testing.T) {
	status := toggleLight("newdeveloper", "localhost:8000", true, 8)
	if !status {
		t.Error("Expected to turn on light but it can't")
	}
}

func TestGetXtY(t *testing.T) {
	status := getXY(10, 10, 10)
	if !reflect.DeepEqual(status, []float64{0.3127, 0.329}) {
		t.Error("Expected to get XY but it can't")
	}
}

func TestToFixed(t *testing.T) {
	value := toFixed(10.0001, 3)
	if value != 10 {
		t.Error("Expected to get 10 but it didn't")
	}
}

func TestChangeBrightness(t *testing.T) {
	status := changeBrightness("newdeveloper", "localhost:8000", 240, 1)
	if !status {
		t.Error("Expected to change brightness of light but it can't")
	}
}

func TestChangeColor(t *testing.T) {
	status := changeColor("newdeveloper", "localhost:8000", "#311111", 1)
	if !status {
		t.Error("Expected to change colour of light but it can't")
	}
}

func TestHexToHsv(t *testing.T) {
	value, _, _ := hexToHsv("000000")
	if value != 0 {
		t.Error("Expected to get Hsv but it can't")
	}
}

func TestHexToRGB(t *testing.T) {
	value, _, _ := hexToRGB("000000")
	if value != 0 {
		t.Error("Expected to get RGB but it can't")
	}
}

func TestToString(t *testing.T) {
	value := toString(1)
	whichType := reflect.TypeOf(value).String()
	if whichType != "string" {
		t.Error("Expected to get RGB but it can't")
	}
}
