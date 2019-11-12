package main

import "testing"

func TestToInt(t *testing.T) {
	if toInt("42") != 42 {
		t.Error("Expected string conversion of '42' to integer to be 42")
	}
}
func TestToFloat(t *testing.T) {
	if toFloat("42.69") != 42.69 {
		t.Error("Expected string conversion of '42.69' to float64 to be 42.69")
	}
}
