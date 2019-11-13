#include "MicroBit.h"
#include "time.h"

MicroBit uBit;
int zoneId = -2;
int signalStrength = -128;
char currentLocation = '0';
int userLocationLastUpdateTime = 0;
int currentTime = 0;

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

int temperature = getTemperature();
int moisture = getMoistureLevel();
int light = getLightLevel();

void printzoneId() {
  if (zoneId > 0) {
      uBit.display.print(zoneId);
    }
    else if (zoneId == 0) {
      uBit.display.print("R");
    }
    else if (zoneId == -1){
      uBit.display.print("U");
    }
    else {
      uBit.display.print("-");
    }
}

void onButtonEvent(MicroBitEvent e) {
  int maxZones = 3;
  if (e.source == MICROBIT_ID_BUTTON_A && zoneId > -1) {
    zoneId--;
  }
  else if (e.source == MICROBIT_ID_BUTTON_B && zoneId < maxZones) {
    zoneId++;
  }
  else if (e.source == MICROBIT_ID_BUTTON_AB) {
    zoneId = -2;
  }
}

void sendMessage(int t, int m, int l) {
  ManagedString zone(zoneId);
  ManagedString temp(t);
  ManagedString moist(m);
  ManagedString light(l);
  ManagedString space(" ");

  ManagedString msg = zone + space
    + temp + space
    + moist + space
    + light;

  uBit.radio.datagram.send(msg);
  uBit.serial.printf("S%s\r\n", msg.toCharArray());
}

void receiveMessage(MicroBitEvent) {
  ManagedString recv = uBit.radio.datagram.recv();
  const char* msg = recv.toCharArray();

  // Receiver
  if (zoneId == 0) {
    // Change zone each time it changes
    if (msg[0] == 'U') {
      currentLocation = msg[1];
      userLocationLastUpdateTime = currentTime;
    } else {
      if(currentTime-userLocationLastUpdateTime<10){
        uBit.serial.printf("R%s %c\r\n", msg, currentLocation);
      } else {
        //No user recived for more then 10 seconds - so send 0 for location
        uBit.serial.printf("R%s 0\r\n", msg);
      }
    }
  }

  //User
  if(msg[0] != 'U' && zoneId == -1) {
    if (msg[0] == currentLocation) {
      signalStrength = uBit.radio.getRSSI();
    }
    if (uBit.radio.getRSSI() > signalStrength) {
      signalStrength = uBit.radio.getRSSI();
      currentLocation = msg[0];
    }
    ManagedString prefix("U");
    ManagedString zone(currentLocation);
    uBit.radio.datagram.send(prefix + zone);
    uBit.serial.printf("S%s%s\r\n", prefix.toCharArray(),zone.toCharArray());
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

    // Senders
    if (zoneId > 0) {
      temperature = getTemperature();
      moisture = getMoistureLevel();
      light = getLightLevel();

      sendMessage(temperature, moisture, light);
    }

    printzoneId();
    currentTime = currentTime + 1;
    uBit.sleep(1000);
  }
}