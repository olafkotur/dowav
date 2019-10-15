#include "MicroBit.h"

MicroBit uBit;
int workerNumber = 0;

// Returns temperature in celcius
int getTemperature() {
  return uBit.thermometer.getTemperature();
}

// Returns light level from 0 - 255
int getLightLevel() {
  return uBit.display.readLightLevel();
}

// Returns humidity level as percentage
int getHumidityLevel() {
  int tempC = getTemperature();
  int satVapour = 6.11 * (10 * ((7.5 * tempC) / 237.3 + tempC));
  // TODO: Can't caclulate actual vapour without dew point, unsure how to get this
  // int actVapour = 6.11 * (10 * ((7.5 * dewPoint) / 237.3 + dewPoint));
  // int humidity = (actVapour / satVapour) * 100;
  return satVapour;
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

// Returns moisture level
int getMoistureLevel() {
  return uBit.io.P1.getAnalogValue();
}

void onButtonEvent(MicroBitEvent e) {
  int maxWorkers = 5;
  if (e.source == MICROBIT_ID_BUTTON_A && workerNumber > 1) {
    workerNumber--;
  }
  else if (e.source == MICROBIT_ID_BUTTON_B && workerNumber < maxWorkers) {
    workerNumber++;
  }
  else if (e.source == MICROBIT_ID_BUTTON_AB) {
    workerNumber = 0;
  }
}

int main() {
  uBit.init();

  uBit.messageBus.listen(MICROBIT_ID_BUTTON_A, MICROBIT_BUTTON_EVT_CLICK, onButtonEvent);
  uBit.messageBus.listen(MICROBIT_ID_BUTTON_B, MICROBIT_BUTTON_EVT_CLICK, onButtonEvent);
  uBit.messageBus.listen(MICROBIT_ID_BUTTON_AB, MICROBIT_BUTTON_EVT_CLICK, onButtonEvent);

  while(true) {
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

    uBit.sleep(250);
  }

  release_fiber();
}