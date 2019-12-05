const request = require("request")
const delay = require('delay');
const url = 'http://dowav-api.herokuapp.com'

const colors = {
  blue: '#0000FF',
  red: '#DC143C',
  yellow: '#FFD700',
  green: '#008000',
  purple: '#4B0082',
  pink: '#FF00FF',
  white: '#fff',
  cyan: '#00ffff',
  orange: '#FF8C00',
}

module.exports = {
  changeColor: async (zone, color) => {
    return new Promise((resolve, reject) => {
      request({uri: url + '/api/setting/all', method: 'GET'}, (error, response, body) => {
        const data = JSON.parse(body)
        const settings = data[zone - 1]
        const hex = colors[color]
        const updatedSettings = {
          zone: settings.zone,
          plant: settings.plant,
          shouldSendTweets: settings.shouldSendTweets,
          minTemperature: settings.minTemperature,
          maxTemperature: settings.maxTemperature,
          minLight: settings.minLight,
          maxLight: settings.maxLight,
          minMoisture: settings.minMoisture,
          bulbColor: hex,
          bulbBrightness: settings.bulbBrightness
        }

        const msg = hex ? `Changed the light color in zone ${zone} to ${color}` : 'I dont recognise that color, please try again';
        resolve(msg)
        if (hex) {
        request({
            uri: url + '/api/setting', 
            method: 'POST',
            body: JSON.stringify([updatedSettings])
        }, (error2, response2, body2) => {
            console.log(body2)
        })
        }
      });
    })
  },

  changeBrightness: async (action, zone) => {
    return new Promise((resolve, reject) => {
      request({uri: url + '/api/setting/all', method: 'GET'}, (error, response, body) => {
        const data = JSON.parse(body)
        const settings = data[zone - 1]
        let brightness = action === 'decrease' ? -50 : 50;
        if (brightness > 254) {
          brightness = 254;
        }
        if (brightness < 0) {
          brightness = 0;
        }

        const updatedSettings = {
          zone: settings.zone,
          plant: settings.plant,
          shouldSendTweets: settings.shouldSendTweets,
          minTemperature: settings.minTemperature,
          maxTemperature: settings.maxTemperature,
          minLight: settings.minLight,
          maxLight: settings.maxLight,
          minMoisture: settings.minMoisture,
          bulbColor: settings.bulbColor,
          bulbBrightness: settings.bulbBrightness + brightness
        }
    
        const msg = `Changed the light brightness in zone ${zone}`;
        resolve(msg)
        request({
            uri: url + '/api/setting', 
            method: 'POST',
            body: JSON.stringify([updatedSettings])
        }, (error2, response2, body2) => {
            console.log(body2)
        })
      });
    });
  },

  getLiveData: async (type) => {
    return new Promise((resolve, reject) => {
      request({uri: url + '/api/live/' + type, method: 'GET'}, (error, response, body) => {
        const data = JSON.parse(body)
        const zone1 = data[0].Value;
        const zone2 = data[1].Value;
        const zone3 = data[2].Value;
    
        const msg = `The ${type} in zone 1 is ${zone1}, ${zone2} in zone 2 and ${zone3} in zone 3`;
        resolve(msg)
      });
    });
  },

  partyProtocol: () => {
    request({uri: url + '/api/setting/all', method: 'GET'}, async (error, response, body) => {
      const settings = JSON.parse(body);
      const keys = Object.keys(colors);
    
      async function party() {
        const i = 3 * Math.random() << 0;
        let color = colors[keys[keys.length * Math.random() << 0]];
        let updatedSettings = {
          zone: settings[i].zone,
          plant: settings[i].plant,
          shouldSendTweets: settings[i].shouldSendTweets,
          minTemperature: settings[i].minTemperature,
          maxTemperature: settings[i].maxTemperature,
          minLight: settings[i].minLight,
          maxLight: settings[i].maxLight,
          minMoisture: settings[i].minMoisture,
          bulbColor: color,
          bulbBrightness: 254
        };
        request({
          uri: url + '/api/setting', 
          method: 'POST',
          body: JSON.stringify([updatedSettings])
        }, (error2, response2, body2) => console.log(body2))
      }
    
      let counter = 18;
      while (counter !== 0) {
        await delay(500).then(party())
        counter--;
      }
    });
  }
}