package main

import (
	"fmt"
	"strconv"
	"testing"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func TestQueryHourlyData(t *testing.T) {
	value := queryHourlyData("TestDB", 0)
	i1, err := strconv.Atoi(value)
	if err == nil {
		fmt.Println(i1)
	}
	if i1 == 0 {
		t.Error("Expected the last value of the TestDB talbe instead of 0")
	}
}

func TestQueryMaxData(t *testing.T) {
	value := queryMaxData("TestDB", "temp", 0)
	i1, err := strconv.Atoi(value)
	if err == nil {
		fmt.Println(i1)
	}
	if i1 != 300 {
		t.Error("Expected to be 300 for max temp in TestDB")
	}
}

func TestQueryMinData(t *testing.T) {
	value := queryMinData("TestDB", "temp", 0)
	i1, err := strconv.Atoi(value)
	if err == nil {
		fmt.Println(i1)
	}
	if i1 != 0 {
		t.Error("Expected to be 0 for min temp in TestDB")
	}
}

func TestQueryAvgData(t *testing.T) {
	value := queryAvgData("TestDB", "temp", 0)
	i1, err := strconv.Atoi(value)
	if err == nil {
		fmt.Println(i1)
	}
	if i1 != 150 {
		t.Error("Expected to be 150 for Average temp in TestDB")
	}
}

func TestInsertData(t *testing.T) {
	insertData("TestIDB", 10, 10, 10, 10)
	th := time.Now()
	tH := th.Hour()

	value := queryHourlyData("TestIDB", tH)
	i1, err := strconv.Atoi(value)
	if err == nil {
		fmt.Println(i1)
	}

	if i1 != 10 {
		t.Log(value)
		t.Error("Expected to be 10 as last value was 10")
	}
}
