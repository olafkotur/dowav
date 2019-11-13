package main

import (
	"database/sql"
	"fmt"
	"log"

	//"reflect"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func checkDeletion(start time.Time, lastHourDiff int) (hDiff int) {
	diff := time.Now().Sub(start)
	hourDiff := int(diff.Hours())
	if hourDiff >= 24 && lastHourDiff != hourDiff {
		//fmt.Println(reflect.TypeOf(hourDiff))
		deleteHr := (hourDiff % 24)
		deleteHour("db", deleteHr) // *should add all microbit(DB)
	}
	return hourDiff
}

/*
 * Query all data in table(Query hourly data)
 * param microbit : name of DB (microbit number)
 * param hour     : name of table (hour)
 */
func queryHourlyData(microbit string, hour int) (vals string) { //microbit = name of DB, hour = name of table
	// Open database connection
	db, err := sql.Open("mysql", "pi:pythones@tcp(127.0.0.1:3306)/"+microbit)
	if err != nil {
		log.Println(err)
		return
	}
	hr := intToString(hour)
	// Execute the query
	rows, err := db.Query("SELECT * FROM " + hr + "hour")
	if err != nil {
		log.Println(err)
		return
	}
	columns, err := rows.Columns()
	if err != nil {
		log.Println(err)
		return
	}
	db.Close()
	//fmt.Println(reflect.TypeOf(rows))

	//fmt.Println(reflect.TypeOf(columns))

	// Make a slice for the values
	values := make([]sql.RawBytes, len(columns))

	//fmt.Println(reflect.TypeOf(values[0]))

	// rows.Scan wants '[]interface{}' as an argument, so we must copy the
	// references into such a slice

	scanArgs := make([]interface{}, len(values))
	for i := range values {
		scanArgs[i] = &values[i]
		//fmt.Println(values[i])
	}
	//fmt.Println(reflect.TypeOf(scanArgs))
	var val string //testing purpose
	for rows.Next() {
		// get RawBytes from data
		err = rows.Scan(scanArgs...)
		if err != nil {
			log.Println(err)
			return
		}

		// print each column as a string.
		var value string
		for i, col := range values {
			// check if the value is nil (NULL value)
			if col == nil {
				value = "NULL"
			} else {
				value = string(col)
			}
			fmt.Println(columns[i], ": ", value)
		}
		val = value
		fmt.Println("-----------------------------------")
	}
	if err = rows.Err(); err != nil {
		log.Println(err)
		return
	}
	return val
}

func queryMaxData(microbit, data string, hour int) (maxV string) {
	db, err := sql.Open("mysql", "pi:pythones@tcp(127.0.0.1:3306)/"+microbit)
	if err != nil {
		log.Println(err)
	}
	hr := intToString(hour)
	var max string
	err = db.QueryRow("SELECT MAX(" + data + ") FROM " + hr + "hour;").Scan(&max)
	if err != nil {
		log.Println(err)
	}
	db.Close()
	//fmt.Println(name)
	return max
}

func queryMinData(microbit, data string, hour int) (minV string) {
	db, err := sql.Open("mysql", "pi:pythones@tcp(127.0.0.1:3306)/"+microbit)
	if err != nil {
		log.Println(err)
	}
	hr := intToString(hour)
	var min string
	err = db.QueryRow("SELECT MIN(" + data + ") FROM " + hr + "hour;").Scan(&min)
	if err != nil {
		log.Println(err)
	}
	db.Close()

	//fmt.Println(min)
	return min
}

func queryAvgData(microbit, data string, hour int) (avgV string) {
	db, err := sql.Open("mysql", "pi:pythones@tcp(127.0.0.1:3306)/"+microbit)
	if err != nil {
		log.Println(err)
	}
	hr := intToString(hour)
	var avg string
	err = db.QueryRow("SELECT AVG(" + data + ") FROM " + hr + "hour;").Scan(&avg)
	if err != nil {
		log.Println(err)
	}
	db.Close()

	//fmt.Println(avg)
	return avg
}

//delete data inside table
func deleteHour(microbit string, hour int) {
	db, err := sql.Open("mysql", "pi:pythones@tcp(127.0.0.1:3306)/"+microbit)
	if err != nil {
		log.Println(err)
	}
	hr := intToString(hour)
	var name string
	err = db.QueryRow("DELETE FROM " + hr + "hour;").Scan(&name)
	if err != nil {
		log.Println(err)
	}
	db.Close()

	fmt.Println(name)
}

//insert data to table of database it will automatically add to table
func insertData(microbit string, temp, humidity, light, location int) {
	db, err := sql.Open("mysql", "pi:pythones@tcp(127.0.0.1:3306)/"+microbit)
	if err != nil {
		log.Println(err)
	}
	t := time.Now()
	hour := intToString(t.Hour())

	result, err := db.Exec("INSERT INTO "+hour+"hour"+" VALUES (?, ?, ?, ?, ?)", t, temp, humidity, light, location)

	if err != nil {
		log.Println(err)
	}
	db.Close()
	n, err := result.RowsAffected()
	if n == 1 {
		//fmt.Println("1 row inserted.")
	}
}

func intToString(i int) (s string) {
	return strconv.Itoa(i)
}
