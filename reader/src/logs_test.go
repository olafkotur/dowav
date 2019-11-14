package main

import (
	"strings"
	"testing"
)

func TestCreateLogFile(t *testing.T) {
	path := createLogFile()
	if strings.Contains(path, "../logs/log-") == false {
		t.Error("Expected log file to be in dir ../logs with name log-*")
	}
}

func TestGetLatestLog(t *testing.T) {
	log := getLatestLog()
	if strings.Contains(log, "log-") == false {
		t.Error("Expected latest log to have name pattern of log-*")
	}
}

func TestGetDataAsString(t *testing.T) {
	data := getDataAsString("../_test.txt")
	if data == "" {
		t.Error("Expected returned data from test logs to not be empty")
	}
}
