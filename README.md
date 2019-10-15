# Pythones - Software Engineering

## General
* Go into the desired directory you would like the project to be in
* `git clone git@github.com:olafkotur/pythones.git`

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

### Screening (Linux)
* Run `mesg | tail`
* Get the number of the result that looks something like `/dev/ttyUSB0`
* Run `screen /dev/ttyUSB0 115200` replacing the value `ttyUSB0` with the number that you got from the previous command

### Screening (Mac)
* Run `ls /dev/cu.*`
* Get the number of the result that looks something like `/dev/cu.usbmodem1422`
* Run `screen /dev/cu.usbmodem1422 115200` replacing the value `1422` with the number that you got from the previous command

### Screening (Windows)
* Download, install and then run TeraTerm: https://osdn.net/projects/ttssh2/releases/
* In the new connection pop-up (file->new connection, may open automaticly) if the serial radio button is greyed out aditionally download and install this driver: https://os.mbed.com/handbook/Windows-serial-configuration
* In the new connection pop up tick the serial radio button and select `mbed Serial Port`. You will need to close and re-open TeraTerm if you have just installed the aditional driver
* Go to setup->terminal and change the recive dropdown to `LF`
* Go to setup->serial poirt and change speed to `115200`
* You will need to do these last 2 each time TeraTerm is restarted, alterntivly you can change the deafult settings to match these by going settup->save setup and overwriting the promted file

