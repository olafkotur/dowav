#include "MicroBit.h"
MicroBit uBit;

class Thermometer {
  // Returns temperature in celcius
  public: int getTemperature() {
    return uBit.thermometer.getTemperature();
  }

};

class Accelorometer {
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


int main() {
  uBit.init();
  Thermometer therm;
  Accelorometer acc; 

  while(1) {
    int x = acc.getAccelorometerX();
    int y = acc.getAccelorometerY();
    int z = acc.getAccelorometerZ();
    int temp = therm.getTemperature();

    uBit.serial.printf("X: %d, Y: %d, Z: %d, Temp: %d\r", x, y, z, temp);
  }

  release_fiber();
}