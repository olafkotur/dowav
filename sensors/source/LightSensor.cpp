#include "MicroBit.h"

class LightSensor {
  MicroBit uBit;
  
  public: int getLight() {
    return uBit.display.readLightLevel();
  }

};