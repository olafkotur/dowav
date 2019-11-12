package main

import "testing"

func TestToInt(t *testing.T) {
	if toInt("42") != 42 {
		t.Error("Expected string conversion of '42' to integer to be 42")
	}
}
func TestToString(t *testing.T) {
	if toString(42) != "42" {
		t.Error("Expected int conversion of 42 to string to be '42'")
	}
}
