package main

import (
	"database/sql"
	"fmt"
	"log"
	//"reflect"
	"time"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
)

func main(){
	queryHourlyData("db", "mic1")
	startTime := time.Now()
    var lastHourDiff int
	//fmt.Println(reflect.TypeOf(time.Now()))
	lastHourDiff = checkDeletion(startTime, lastHourDiff)
	//insertData("db", 17, 300, 20, 300)	
}

func checkDeletion (start time.Time, lastHourDiff int) (hDiff int){
	diff := time.Now().Sub(start)
	hourDiff := int(diff.Hours())
	if hourDiff >= 24 && lastHourDiff != hourDiff{
		//fmt.Println(reflect.TypeOf(hourDiff))
		deleteHr := intToString(hourDiff%24)
		deleteHour("db", deleteHr)  // *should add all microbit(DB)
	}	
	return hourDiff
}

/*
 * Query all data in table(Query hourly data)
 * param microbit : name of DB (microbit number)
 * param hour     : name of table (hour)
 */
func queryHourlyData(microbit, hour string)() { //microbit = name of DB, hour = name of table 
	// Open database connection
	db, err := sql.Open("mysql", "pi:pythones@tcp(127.0.0.1:3306)/" + microbit)
	if err != nil {
		log.Println(err)
		return
	}
	defer db.Close()

	// Execute the query
	rows, err := db.Query("SELECT * FROM " + hour)
	if err != nil {
		log.Println(err)
		return
	}
	columns, err := rows.Columns()
	if err != nil {
		log.Println(err)
		return
	}
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
		fmt.Println("-----------------------------------")
	}
	if err = rows.Err(); err != nil {
		log.Println(err)
		return
	}
}

func queryMaxData(microbit, data string, hour string) {
	db, err := sql.Open("mysql", "pi:pythones@tcp(127.0.0.1:3306)/" + microbit)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	var name string
	err = db.QueryRow("SELECT MAX(" + data + ") FROM "+ hour + ";").Scan(&name)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(name)
}

func queryMinData(microbit, data string, hour string) {
	db, err := sql.Open("mysql", "pi:pythones@tcp(127.0.0.1:3306)/" + microbit)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	var name string
	err = db.QueryRow("SELECT MIN(" + data + ") FROM "+ hour + ";").Scan(&name)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(name)
}

func queryAvgData(microbit, data string, hour string) {
	db, err := sql.Open("mysql", "pi:pythones@tcp(127.0.0.1:3306)/" + microbit)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	var name string
	err = db.QueryRow("SELECT AVG(" + data + ") FROM "+ hour + ";").Scan(&name)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(name)
}

//delete data inside table
func deleteHour(microbit, hour string) {
	db, err := sql.Open("mysql", "pi:pythones@tcp(127.0.0.1:3306)/" + microbit)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	var name string
	err = db.QueryRow("DELETE FROM "+ hour + ";").Scan(&name)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(name)
}

//insert data to table of database it will automatically add to table
func insertData(microbit string, temp, humidity, light int)(){
	db, err := sql.Open("mysql", "pi:pythones@tcp(127.0.0.1:3306)/" + microbit)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

    t := time.Now()
	hour := intToString(t.Hour())
	
	result, err := db.Exec("INSERT INTO " + hour + "hour" + " VALUES (?, ?, ?)", temp, humidity, light) 

	if err != nil {
		log.Fatal(err)
	}

	n, err := result.RowsAffected()
	if n == 1 {
		fmt.Println("1 row inserted.")
	}
}

func intToString(i int) (s string) {
	return strconv.Itoa(i)
}
