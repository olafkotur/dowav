const request = require("request")
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
        const brightness = action === 'decrease' ? -50 : 50;
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
  }
}