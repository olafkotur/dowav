package main

import (
	"reflect"
	"testing"
)

func TestcreateHueId(t *testing.T) {
	_, status := createHueId("localhost:8000")
	if !status {
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
