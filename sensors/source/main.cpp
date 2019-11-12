#include "MicroBit.h"

MicroBit uBit;
int zoneId = 0;

// Returns 0-1024 range representing the voltage on pin 0. Use a resistive divider with pin0 between 3V and ground. With the nichrome wire & cup being between pin0 and ground.
int getWaterLevel() {
    MicroBitPin P0(MICROBIT_ID_IO_P0, MICROBIT_PIN_P0, PIN_CAPABILITY_ANALOG);
    return P0.getAnalogValue();
}

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

// Returns X force measured in milli-g
int getAccelorometerX() {
  uBit.accelerometer.setPeriod(500);
  return uBit.accelerometer.getX();
}

// Returns Y force measured in milli-g
int getAccelorometerY() {
  uBit.accelerometer.setPeriod(500);
  return uBit.accelerometer.getY();
}

// Returns Z force measured in milli-g
int getAccelorometerZ() {
  uBit.accelerometer.setPeriod(500);
  return uBit.accelerometer.getZ();
}

// Returns moisture value in range 0 - 1024
int getMoistureLevel() {
  uBit.io.P1.setAnalogPeriod(250);
  return uBit.io.P1.getAnalogValue();
}

void printzoneId() {
  if (zoneId > 0) {
      uBit.display.print(zoneId);
    }
    else if (zoneId < 0) {
      uBit.display.print("R");
    }
    else {
      uBit.display.print("-");
    }
}

void onButtonEvent(MicroBitEvent e) {
  int maxZones = 3;
  if (e.source == MICROBIT_ID_BUTTON_A && zoneId > 1) {
    zoneId--;
  }
  else if (e.source == MICROBIT_ID_BUTTON_B && zoneId < maxZones) {
    zoneId++;
  }
  else if (e.source == MICROBIT_ID_BUTTON_AB) {
    zoneId = -1;
  }
}

void sendMessage(int t, int m, int l, int w) {
  ManagedString zone(zoneId);
  ManagedString temp(t);
  ManagedString moist(m);
  ManagedString light(l);
  ManagedString water(w);
  ManagedString space(" ");

  ManagedString msg = zone + space 
    + temp + space
    + moist + space
    + light + space
    + water;

  uBit.radio.datagram.send(msg);
  uBit.serial.printf("S%s\r\n", msg.toCharArray());
}

void receiveMessage(MicroBitEvent) {
  ManagedString recv = uBit.radio.datagram.recv();
  if (zoneId == -1) {
    const char* msg = recv.toCharArray();
    uBit.serial.printf("R%s\r\n", msg);
  }
}

int main() {
  uBit.init();
  uBit.radio.enable();
  uBit.radio.setGroup(3);

  uBit.messageBus.listen(MICROBIT_ID_BUTTON_A, MICROBIT_BUTTON_EVT_CLICK, onButtonEvent);
  uBit.messageBus.listen(MICROBIT_ID_BUTTON_B, MICROBIT_BUTTON_EVT_CLICK, onButtonEvent);
  uBit.messageBus.listen(MICROBIT_ID_BUTTON_AB, MICROBIT_BUTTON_EVT_CLICK, onButtonEvent);
  uBit.messageBus.listen(MICROBIT_ID_RADIO, MICROBIT_RADIO_EVT_DATAGRAM, receiveMessage);

  while(true) {

    if (zoneId > 0) {
      int temperature = getTemperature();
      int moisture = getMoistureLevel();
      int light = getLightLevel();
      int water = getWaterLevel();

      sendMessage(temperature, moisture, light, water);
    }

    printzoneId();
    uBit.sleep(1000);
  }
}