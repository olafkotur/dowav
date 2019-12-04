#include "MicroBit.h"
#include "time.h"
#include "math.h"

MicroBit uBit;
int zoneId = 0;
int deviceID = 0;
int oldDeviceID = deviceID;//Used to detect changes for display update
int signalStrength = -128;
char currentLocation = '0';
int userLocationLastUpdateTime = 0;
int currentTime = 0;
int version = 1;
int on = 0;
int maxZones = 6;

int distanceFrom1 = 0;
int distanceFrom2 = 0;
int distanceFrom3 = 0;

int xZ1 = 0;
int yZ1 = 0;
int s1 = 0;
int xZ2 = 0;
int yZ2 = 1700;
int s2 = 0;
int xZ3 = 240;
int yZ3 = 800;
int s3 = 0;

//int calibratePower = 0;

int currentX = 0;
int currentY = 0;

int roomSizeX = 800;
int roomSizeY = 1700;
int searchResolution = 50;


// Returns 0-1024 range representing the voltage on pin 0. Use a resistive divider with pin0 between 3V and ground. With the nichrome wire & cup being between pin0 and ground.
int getWaterLevel() {
    MicroBitPin P0(MICROBIT_ID_IO_P0, MICROBIT_PIN_P0, PIN_CAPABILITY_ANALOG);
    if(((-7.4286 * (P0.getAnalogValue()))+1006.3) < 0){
      //Wire not connected
      return 0;
    } else if (((-7.4286 * (P0.getAnalogValue()))+1006.3) > 1002 &&  ((-7.4286 * (P0.getAnalogValue()))+1006.3) < 1005){
      //No water
      return 0;
    } else if(((-7.4286 * (P0.getAnalogValue()))+1006.3) > 12){
      return 12;
    } else {
      return (-7.4286 * (P0.getAnalogValue()))+1006.3;
    }
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

float measuredPower = -62.0;
int RSSIToDistance(float rssi){
  //https://iotandelectronics.wordpress.com/2016/10/07/how-to-calculate-distance-from-the-rssi-value-of-the-ble-beacon/
  return pow(10,(measuredPower - rssi)/(10.0*2.0))*100;
  //return pow(10,0.1)*100;
}

int distanceBetweenPoints(int x1,int y1, int x2, int y2){
  return sqrt(pow((x2-x1),2)+pow(y2-y1,2));
}

int temperature = getTemperature();
int moisture = getMoistureLevel();
int light = getLightLevel();
int waterLevel = getWaterLevel();
int accelerometerX = getAccelorometerX();
int accelerometerY = getAccelorometerY();
int accelerometerZ = getAccelorometerZ();

void setDeviceId(){
  if(zoneId == 3 || zoneId == 1){
    //User or watering can
    if(uBit.io.P0.isTouched()==true){
      deviceID = 0;
    } else if(uBit.io.P1.isTouched()==true){
      deviceID = 1;
    } else if(uBit.io.P2.isTouched()==true){
      deviceID = 2;
    }

    if(deviceID != oldDeviceID){
      //ManagedString deivceIDmsg("ID:");
      //uBit.display.scrollAsync(deivceIDmsg + deviceID);
      oldDeviceID = deviceID;
    }
  }

}

void printzoneId() {
  if(on == 0){
    uBit.display.setBrightness(25);
  } else if (on == 1){
    uBit.display.setBrightness(255);
  }

  if (zoneId > 3) {
      uBit.display.print(zoneId-3);
  }
  else if (zoneId == 3) {
      uBit.display.print("W");
    }
  else if (zoneId == 2) {
    uBit.display.print("R");
  }
  else if (zoneId == 1){
    uBit.display.print("U");
  }
  else {
    uBit.display.print("-");
  }
}

void onButtonEvent(MicroBitEvent e) {
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
  const char* temp = msg.toCharArray();
  uBit.serial.printf("%s\r\n", temp);
  delete [] temp;
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
      }
      uBit.serial.printf("%s\r\n", msg);
    }

  //User
    if(msg[1] != 'U' && msg[1] != 'W' && zoneId == 1) {
      int recivedZone = (int)msg[1] % 48;//https://stackoverflow.com/questions/5029840/convert-char-to-int-in-c-and-c
      if (recivedZone == 1){
        s1 = RSSIToDistance(uBit.radio.getRSSI());
      } else if (recivedZone == 2){
        s2 = RSSIToDistance(uBit.radio.getRSSI());
      } else if (recivedZone == 3){
        s3 = RSSIToDistance(uBit.radio.getRSSI());
      }

      uBit.serial.printf("Zone %i strength: %i\r\b",recivedZone,uBit.radio.getRSSI());

      int currentError = -1;
      int tempError;
      for(int x=0;x<roomSizeX;x=x+searchResolution){
        for(int y=0;y<roomSizeY;y=y+searchResolution){
          tempError = abs(distanceBetweenPoints(x,y,xZ1,yZ1) - s1) + abs(distanceBetweenPoints(x,y,xZ2,yZ2) - s2) + abs(distanceBetweenPoints(x,y,xZ3,yZ3) - s3);
          if(tempError<currentError || currentError == -1){
            currentX = x;
            currentY = y;
            currentError = tempError;
          }
        }
      }

       //uBit.serial.printf("1:%i 2:%i 3:%i\r\n",s1,s2,s3);
       //uBit.serial.printf("X:%i Y:%i\r\n",currentX,currentY);
    }
  }

  delete [] msg;

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
      // Sensors
      if (zoneId > 3) {
        temperature = getTemperature();
        moisture = getMoistureLevel();
        light = getLightLevel();
        waterLevel = getWaterLevel();

        ManagedString toSend(ManagedString('R') +
                             ManagedString(zoneId-3) + ManagedString(' ') +
                             ManagedString(temperature) + ManagedString(' ') +
                             ManagedString(moisture) + ManagedString(' ') +
                             ManagedString(light) + ManagedString(' ') +
                             ManagedString(waterLevel));
        sendMessage(toSend);

      //Reciver
      } else if (zoneId == 2){
        int input;
        char str[64];
        int i = 0;
        do{
          input = uBit.serial.read(ASYNC);
          if(input != MICROBIT_NO_DATA){
            str[i] = (char)input;
            i++;
          }
        } while (input != MICROBIT_NO_DATA);
        str[i] = '\0';
        if(i != 0){
          ManagedString inputMS(str);
          sendMessage(inputMS);
        }

      } else if (zoneId == 3){
        //Watering can
        waterLevel = getWaterLevel();
        accelerometerX = getAccelorometerX();
        accelerometerY = getAccelorometerY();
        accelerometerZ = getAccelorometerZ();

        ManagedString toSend(ManagedString('W') + ManagedString(deviceID) + ManagedString(' ') +
                                                 ManagedString(accelerometerX) + ManagedString(' ') +
                                                 ManagedString(accelerometerY) + ManagedString(' ') +
                                                 ManagedString(accelerometerZ) + ManagedString(' ') +
                                                 ManagedString(waterLevel));
        sendMessage(toSend);
      }
    }
    currentTime = currentTime + 1;
    if (zoneId == 3){
      uBit.sleep(500);
    } else {
      uBit.sleep(1000);
    }
    printzoneId();
    setDeviceId();
  }
}