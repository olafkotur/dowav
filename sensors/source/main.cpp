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

    // Worker tasks
    if (workerNumber == 1) {
      int value = getTemperature();
      uBit.serial.printf("Temperature: %d\r\n", value);
    }
    else if (workerNumber == 2) {
      int value = getHumidityLevel();
      uBit.serial.printf("Humidity: %d\r\n", value);
    }
    else if (workerNumber == 3) {
      int value = getLightLevel();
      uBit.serial.printf("Light: %d\r\n", value);
    }

    uBit.sleep(100);
  }

  release_fiber();
}