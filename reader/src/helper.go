package main

import (
	"strings"
)

func isStringSimilar(str1, str2 string) (b bool) {
	threshold := 90.0

	arr1 := strings.Split(str1, " ")
	arr2 := strings.Split(str2, " ")

	var primary, secondary []string
	var similaritiesFound float64

	// Determine which string should be scanned first
	if len(arr1) > len(arr2) || len(arr1) == len(arr2) {
		primary = arr2
		secondary = arr1
	} else {
		primary = arr1
		secondary = arr2
	}

	// Scan the strings for comparison
	for i := range primary {
		if primary[i] == secondary[i] {
			similaritiesFound++
		}
	}

	// Calculate the percentage similarity
	percent := similaritiesFound / float64(len(primary)) * 100.0
	if percent >= threshold {
		return true
	}
	return false
}
