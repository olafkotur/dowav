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