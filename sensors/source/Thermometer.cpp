// DANGER: Possible that we do not need this class as the microbit has limited memory for local imports, for now this class has been moved to main.cpp

#include "MicroBit.h"

class Thermometer {
  // Returns temperature in celcius
  public: int getTemperature(MicroBit uBit) {
    return uBit.thermometer.getTemperature();
  }

};