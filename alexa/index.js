const Alexa = require('ask-sdk-core');
const request = require("request");

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

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to your smart greenhouse system. What can I help with?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const LightColorIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'LightColorIntent';
    },
    async handle(handlerInput) {
      const zone = Alexa.getSlotValue(handlerInput.requestEnvelope, "zone")
      const color = Alexa.getSlotValue(handlerInput.requestEnvelope, "color")
      const res = new Promise((resolve, reject) => {
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

      const speakOutput = await res;
      return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        LightColorIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler,
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
