#include "MicroBit.h"

MicroBit uBit;

int main()
{
  uBit.init();

  int previous = 0;

  while(1) {
    bool aPressed = uBit.buttonA.isPressed();
    bool bPressed = uBit.buttonB.isPressed();
    if (aPressed && bPressed) {
        uBit.serial.printf("WAZZZZAAAAAAAAAA");
    }
  }

  release_fiber();
}