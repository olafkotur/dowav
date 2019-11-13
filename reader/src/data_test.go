package main

import (
	"strings"
	"testing"
)

var filteredData []string
var avg []float64
var min, max []int

func TestFilterDataInRange(t *testing.T) {
	data := getDataAsString("../_test.txt")
	filteredData = filterDataInRange(data, 1573133957, 1573134014)
	if strings.Contains(filteredData[0], "1573133958 S1 29 229 255") == false {
		t.Error("Expected test file to contain '1573133958 S1 29 229 255'")
	}
}

func TestCalcAverage(t *testing.T) {
	avg = calcAverage(filteredData)
	if avg[0] != 30 || avg[1] != 248 || avg[2] != 47 {
		t.Error("Expected the average calculation to be 30, 248, 47")
	}
}

func TestCalcMin(t *testing.T) {
	min = calcMin(filteredData)
	if min[0] != 29 || min[1] != 229 || min[2] != 0 {
		t.Log(min)
		t.Error("Expected the minimum calculation to be 30, 229, 0")
	}
}

func TestCalcMax(t *testing.T) {
	max = calcMax(filteredData)
	if max[0] != 32 || max[1] != 255 || max[2] != 255 {
		t.Error("Expected the maximum calculation to be 32, 255, 255")
	}
}

func TestSplitByZone(t *testing.T) {
	zones := splitByZone(filteredData)
	if len(zones[0]) != 22 || len(zones[1]) != 12 || len(zones[2]) != 21 {
		t.Error("Expected there to be 22 values in zone 1, 12 values in zone 2 and 21 values in zone 3")
	}
}
