#!/bin/bash
cd server/

echo Creating Go binary
go build

echo Attempting to start the server
./server