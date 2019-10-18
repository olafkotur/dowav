#include "MicroBit.h"

MicroBit uBit;
int channelId = 0;

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

void printChannelId() {
  if (channelId > 0) {
      uBit.display.print(channelId);
    }
    else if (channelId < 0) {
      uBit.display.print("R");
    }
    else {
      uBit.display.print("-");
    }
}

void onButtonEvent(MicroBitEvent e) {
  int maxWorkers = 5;
  if (e.source == MICROBIT_ID_BUTTON_A && channelId > 1) {
    channelId--;
  }
  else if (e.source == MICROBIT_ID_BUTTON_B && channelId < maxWorkers) {
    channelId++;
  }
  else if (e.source == MICROBIT_ID_BUTTON_AB) {
    channelId = -1;
  }
}

void sendMessage(char* dataType, int data) {
  uBit.serial.printf("SENDING: %s: %d\n", dataType, data);
  ManagedString title(dataType);
  ManagedString value(data);
  ManagedString space(" ");
  ManagedString message = title + space + value;
  uBit.radio.datagram.send(message);
}

void receiveMessage(MicroBitEvent) {
  ManagedString recv = uBit.radio.datagram.recv();
  if (channelId == -1) {
    const char* msg = recv.toCharArray();
    uBit.serial.printf("RECEIVED: %s\n", msg);
  }
}

int main() {
  uBit.init();
  uBit.radio.enable();
  uBit.messageBus.listen(MICROBIT_ID_BUTTON_A, MICROBIT_BUTTON_EVT_CLICK, onButtonEvent);
  uBit.messageBus.listen(MICROBIT_ID_BUTTON_B, MICROBIT_BUTTON_EVT_CLICK, onButtonEvent);
  uBit.messageBus.listen(MICROBIT_ID_BUTTON_AB, MICROBIT_BUTTON_EVT_CLICK, onButtonEvent);
  uBit.messageBus.listen(MICROBIT_ID_RADIO, MICROBIT_RADIO_EVT_DATAGRAM, receiveMessage);

  while(true) {

    printChannelId();

    int data;
    switch(channelId) {
      case 1 :
        data = getTemperature();
        sendMessage("Temperature", data);
        break;

      case 2 :
        data = getLightLevel();
        sendMessage("Light", data);
        break;

      case 3 :
        data = getMoistureLevel();
        sendMessage("Moisture", data);
        break;
    }

    uBit.sleep(250);
  }
}