package main

import "strconv"

// Converts string to int returning only int value
func toInt(s string) (i int) {
	r, err := strconv.Atoi(s)
	if err != nil {
		panic(err)
	}
	return r
}
