# Pythones - Software Engineering

## General
* Go into the desired directory you would like the project to be in
* `git clone git@github.com:olafkotur/pythones.git`

*** 
## Sensors

### Setup
* Ensure you are in the sensors directory `pythones/sensors/`
* Install `yotta` on your machine - this will depend on your environment: https://lancaster-university.github.io/microbit-docs/offline-toolchains/
* Run `yt target bbc-microbit-classic-gcc` to set the target for yotta
* Run `yt install` to install of the dependencies for the project
* Run `yt build` to build the source code into a `.hex` for the microbit to read
* Flash the `.hex` to the microbit by using one the following options below
* You can also `screen` the microbit to get the realtime printed data of the device

### Flashing to Microbit
* Linux: `cp ./build/bbc-microbit-classic-gcc/source/sensors-combined.hex /media/MICROBIT`
* Mac: `cp ./build/bbc-microbit-classic-gcc/source/sensors-combined.hex /Volumes/"MICROBIT"`
* Windows: `copy build\bbc-microbit-classic-gcc\source\sensors-combined.hex E:`

### Screening (Mac)
* Run `ls /dev/cu.*`
* Get the number of the result that looks something like `/dev/cu.usbmodem1422`
* Run `screen /dev/cu.usbmodem1422 115200` replacing the value `1422` with the number that you got from the previous command

### Screening (Linux)
* Run `mesg | tail`
* Get the number of the result that looks something like `/dev/ttyUSB0`
* Run `screen /dev/ttyUSB0 115200` replacing the value `ttyUSB0` with the number that you got from the previous command


