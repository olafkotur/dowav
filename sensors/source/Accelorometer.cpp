// DANGER: Possible that we do not need this class as the microbit has limited memory for local imports, for now this class has been moved to main.cpp

#include "MicroBit.h"

class Accelorometer {
  MicroBit uBit;

  // Returns force measured in milli-g
  public: int getAccelorometerX() {
    uBit.accelerometer.setPeriod(500);
    return uBit.accelerometer.getX();
  }

  // Returns force measured in milli-g
  public: int getAccelorometerY() {
    uBit.accelerometer.setPeriod(500);
    return uBit.accelerometer.getY();
  }

  // Returns force measured in milli-g
  public: int getAccelorometerZ() {
    uBit.accelerometer.setPeriod(500);
    return uBit.accelerometer.getZ();
  }
};