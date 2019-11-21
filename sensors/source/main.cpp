#include "MicroBit.h"
#include "time.h"

MicroBit uBit;
int zoneId = 0;
int signalStrength = -128;
char currentLocation = '0';
int userLocationLastUpdateTime = 0;
int currentTime = 0;
int version = 1;
int on = 0;

// Returns 0-1024 range representing the voltage on pin 0. Use a resistive divider with pin0 between 3V and ground. With the nichrome wire & cup being between pin0 and ground.
int getWaterLevel() {
    MicroBitPin P0(MICROBIT_ID_IO_P0, MICROBIT_PIN_P0, PIN_CAPABILITY_ANALOG);
    return P0.getAnalogValue();
}

// Returns temperature in celcius
int getTemperature() {
  //ManagedString temp("Offset: ");
  //uBit.serial.printf("%s %i\r\n",temp.toCharArray(),uBit.thermometer.getOffset());
  return uBit.thermometer.getTemperature()  - uBit.thermometer.getOffset();
}

// Returns light level from 0 - 255
// Note - first value in light sensor needs to be thrown out
int lightLevelInit = 0;
int getLightLevel() {
  if (lightLevelInit==0){
    lightLevelInit = 1;
    uBit.display.readLightLevel();
  }
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
int toReturn = 255;
int getMoistureLevel() {
  uBit.io.P1.setAnalogPeriod(250);
  toReturn = 255;
  while (toReturn==255){
    toReturn = uBit.io.P1.getAnalogValue();
  }
  return toReturn;
}

int temperature = getTemperature();
int moisture = getMoistureLevel();
int light = getLightLevel();
int water = getWaterLevel();

void printzoneId() {
  if(on == 0){
    uBit.display.setBrightness(25);
  } else if (on == 1){
    uBit.display.setBrightness(255);
  }
  if (zoneId > 2) {
      uBit.display.print(zoneId-2);
  }
  else if (zoneId == 2) {
    uBit.display.printAsync("R");
  }
  else if (zoneId == 1){
    uBit.display.printAsync("U");
  }
  else {
    uBit.display.printAsync("-");
  }
}

void onButtonEvent(MicroBitEvent e) {
  int maxZones = 5;
  if (e.source == MICROBIT_ID_BUTTON_A && zoneId > 0) {
    zoneId--;
  }
  else if (e.source == MICROBIT_ID_BUTTON_B && zoneId < maxZones) {
    zoneId++;
  }
  else if (e.source == MICROBIT_ID_BUTTON_AB) {
    if(on == 0){
      on = 1;
    } else if (on == 1){
      on = 0;
    }
  }
  printzoneId();
}

void sendMessage(ManagedString msg) {
  uBit.radio.datagram.send(msg);
  uBit.serial.printf("S%s\r\n", msg.toCharArray());
}

void receiveMessage(MicroBitEvent) {
  ManagedString recv = uBit.radio.datagram.recv();
  const char* msg = recv.toCharArray();

  // Receiver
  if(on == 1){
    if (zoneId == 2) {
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
    if(msg[0] != 'U' && zoneId == 1) {
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
      uBit.serial.printf("%s\r\n",zone.toCharArray());
    }
  }
}

int main() {
  uBit.init();
  uBit.radio.enable();
  uBit.radio.setGroup(3);
  uBit.thermometer.setCalibration(uBit.thermometer.getTemperature());

  uBit.messageBus.listen(MICROBIT_ID_BUTTON_A, MICROBIT_BUTTON_EVT_CLICK, onButtonEvent);
  uBit.messageBus.listen(MICROBIT_ID_BUTTON_B, MICROBIT_BUTTON_EVT_CLICK, onButtonEvent);
  uBit.messageBus.listen(MICROBIT_ID_BUTTON_AB, MICROBIT_BUTTON_EVT_CLICK, onButtonEvent);
  uBit.messageBus.listen(MICROBIT_ID_RADIO, MICROBIT_RADIO_EVT_DATAGRAM, receiveMessage);

  printzoneId();

  while(true) {
    if (on==1){
      // Senders
      if (zoneId-2 > 0) {
        temperature = getTemperature();
        moisture = getMoistureLevel();
        light = getLightLevel();
        water = getWaterLevel();

        sendMessage(ManagedString(ManagedString(zoneId-2) + ManagedString(' ') +
                                  ManagedString(temperature) + ManagedString(' ') +
                                  ManagedString(moisture) + ManagedString(' ') +
                                  ManagedString(light) + ManagedString(' ') +
                                  ManagedString(water)));
      }
    }
    currentTime = currentTime + 1;
    uBit.sleep(1000);
    printzoneId();
  }
}