#!/bin/bash
cd server/src

echo Creating Go binary
go build -o ../

echo Attempting to start the server
cd ..
./main