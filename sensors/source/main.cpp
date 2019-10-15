#include "MicroBit.h"

MicroBit uBit;

// Returns temperature in celcius
int getTemperature() {
  return uBit.thermometer.getTemperature();
}

// Returns light level from 0 - 255
int getLightLevel() {
  return uBit.display.readLightLevel();
}

int getAccelorometerX() {
  uBit.accelerometer.setPeriod(500);
  return uBit.accelerometer.getX();
}

// Returns force measured in milli-g
int getAccelorometerY() {
  uBit.accelerometer.setPeriod(500);
  return uBit.accelerometer.getY();
}

// Returns force measured in milli-g
int getAccelorometerZ() {
  uBit.accelerometer.setPeriod(500);
  return uBit.accelerometer.getZ();
}

int getHumidityLevel() {
  return uBit.io.P1.getAnalogValue();
}

int main() {
  uBit.init();

  int maxWorkers = 5;
  int workerNumber = 0;
  while(true) {
    // Set worker number value
    if (uBit.buttonAB.isPressed()) {
      workerNumber = 0;
    }
    else if (uBit.buttonB.isPressed() && workerNumber < maxWorkers) {
      workerNumber++;
      uBit.sleep(100);
    }
    else if (uBit.buttonA.isPressed() && workerNumber > 1) {
      workerNumber--;
      uBit.sleep(100);
    }

    // Display worker number value
    if (workerNumber > 0) {
      uBit.display.print(workerNumber);
    }
    else {
      uBit.display.print("-");
    }

    uBit.serial.printf("%d", workerNumber);
    // int x = getAccelorometerX();
    // int y = getAccelorometerY();
    // int z = getAccelorometerZ();
    // int temp = getTemperature();
	  // int ambLight = getLightLevel();
    // int moisture = getHumidityLevel();
    // uBit.serial.printf("X: %d, Y: %d, Z: %d, Temp: %d, Light: %d, Moisture: %d\r", x, y, z, temp, ambLight, moisture);;

    uBit.sleep(100);
  }

  release_fiber();
}