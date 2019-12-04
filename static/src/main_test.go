package main

import "testing"

func TestGetPort(t *testing.T) {
	if getPort() == "" {
		t.Error("Expected port to not be empty")
	}
}

func TestGetPath(t *testing.T) {
	path := getPath()
	if path == "" {
		t.Error("Expected path to not be empty")
	}
}
