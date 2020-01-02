//'use strict';

//Khai báo thư viện để kết nối triển khai code lên firebase-functions
// functions = require('firebase-functions');
// Khai báo các dịch vụ cần dùng được hỗ trợ bởi actions-on-google
var getTemperature = require('./getTemperature')
var socketio = require('../socketio/socketio')
var getSocketId = require('./getSocketId')
var getStateOfDevice = require('./getStateOfDevice');
const {
  dialogflow,
  Suggestions,
  SimpleResponse,
  } = require('actions-on-google');

//Khai báo các gợi ý dành cho người dùng (tối đa 8 gợi ý)
const intentSuggestions = [
  'light on',
  'light off',
  'temperature',
  'fan on',
  'fan off',
];

// Tạo instance "app" để tương tác với dialogflow.
const app = dialogflow({ debug: true });

// Xử lý các Dialogflow intents.
app.intent('Default Welcome Intent', (conv) => {
  conv.ask(`Welcome, How can I help?`);
  conv.ask(new Suggestions(intentSuggestions));
});

app.intent('Control_Devices', async (conv, { devices, status, location, percentage }) => {
      //console.log(location);
      var socketId = await getSocketId.getSocketId('de782a97-bc34-4e39-a005-10973e92b54e');
      switch (location) {
        case 'bedroom':
         if(devices == 'light') {
           var bedroomLightId = '45b0574d-d4c0-449f-8a4c-e2d3fa4786d1';
           if (status == 'status'){
             stateOfDevice = await getStateOfDevice.getStateOfDevice(bedroomLightId);
             console.log(stateOfDevice);
             var stateOfDeviceToResponse = 'on';
             if( stateOfDevice.data == 'inactive') {
               stateOfDeviceToResponse = 'off'
             }
             return conv.ask(`OK, the bed room ${devices} status is ${stateOfDeviceToResponse}. Do you want more?`)
           }
            var emitData = { deviceId : bedroomLightId, action : status, data : 'bedroom' };
            socketio.emitMessage(socketId, emitData);
            conv.ask(`OK, switching ${devices} ${status}. Do you want more?`);
         }else if (devices == 'lamp') {
           var lampId = '8f780bcd-2a48-4cc4-baab-0a277e0710ab';
           if (status == 'status'){
             stateOfDevice = await getStateOfDevice.getStateOfDevice(lampId);
             console.log(stateOfDevice);
             var stateOfDeviceToResponse = 'on';
             if( stateOfDevice.data == 'inactive') {
               stateOfDeviceToResponse = 'off'
             }
             return conv.ask(`OK, the bed room ${devices} status is ${stateOfDeviceToResponse}. Do you want more?`)
            }
            if (status == 'set') {
              if (percentage == '') {
                return conv.ask(`Oops, Can you say that again?`);
              }
              var emitData = { deviceId : lampId, action : percentage, data : 'lamp' };
              socketio.emitMessage(socketId, emitData);
              conv.ask(`OK, ${status} ${devices} ${percentage} percentage. Do you want more?`);
            } else {
                var emitData = { deviceId : lampId, action : status, data : 'lamp' };
                socketio.emitMessage(socketId, emitData);
                conv.ask(`OK, switching ${devices} ${status}. Do you want more?`)
              }
        }
            break;
        case 'rest room':
            var restroomLightId = '57d686a0-f53e-4ddf-8ebb-3a552ac17393';
            if (status == 'status'){
              stateOfDevice = await getStateOfDevice.getStateOfDevice(restroomLightId);
              console.log(stateOfDevice);
              var stateOfDeviceToResponse = 'on';
              if( stateOfDevice.data == 'inactive') {
                stateOfDeviceToResponse = 'off'
              }
              return conv.ask(`OK, the restroom ${devices} status is ${stateOfDeviceToResponse}. Do you want more?`)
            }
            var emitData = { deviceId : restroomLightId, action : status, data : 'restroom' };
            socketio.emitMessage(socketId, emitData);
            conv.ask(`OK, switching ${devices} ${status}. Do you want more?`)
            break;
        case 'kitchen':
            if (devices == 'light') {
              var kitchenLightId = '224f4300-0eed-42a9-bf4b-93947076c4df';
              if (status == 'status'){
                stateOfDevice = await getStateOfDevice.getStateOfDevice(kitchenLightId);
                console.log(stateOfDevice);
                var stateOfDeviceToResponse = 'on';
                if( stateOfDevice.data == 'inactive') {
                  stateOfDeviceToResponse = 'off'
                }
                return conv.ask(`OK, the kitchen ${devices} status is ${stateOfDeviceToResponse}. Do you want more?`)
              }
            var emitData = { deviceId : kitchenLightId, action : status, data : 'kitchen' };
            socketio.emitMessage(socketId, emitData);
            conv.ask(`OK, switching the kitchen ${devices} ${status}. Do you want more?`)
            } else if (devices == 'fan') {
                var fanId = '3a8f0cca-5572-4622-b4cd-376b8abcb7ed';
                if (status == 'status'){
                  stateOfDevice = await getStateOfDevice.getStateOfDevice(fanId);
                  console.log(stateOfDevice);
                  var stateOfDeviceToResponse = 'on';
                  if( stateOfDevice.data == 'inactive') {
                    stateOfDeviceToResponse = 'off'
                  }
                  return conv.ask(`OK, the ${devices} status is ${stateOfDeviceToResponse}. Do you want more?`)
                }
                var emitData = { deviceId : fanId, action : status, data : 'fan' };
                socketio.emitMessage(socketId, emitData);
                conv.ask(`OK, switching ${devices} ${status}. Do you want more?`)
            }
            break;
        case 'living room':
            var livingroomLightId = 'f9a5ea77-6013-4fc3-b6cb-26272f3e9cdc';
            if (status == 'status'){
              stateOfDevice = await getStateOfDevice.getStateOfDevice(livingroomLightId);
              console.log(stateOfDevice);
              var stateOfDeviceToResponse = 'on';
              if( stateOfDevice.data == 'inactive') {
                stateOfDeviceToResponse = 'off'
              }
              return conv.ask(`OK, the living room ${devices} status is ${stateOfDeviceToResponse}. Do you want more?`)
            }
            var emitData = { deviceId : livingroomLightId, action : status, data : 'living-room' };
            socketio.emitMessage(socketId, emitData);
            conv.ask(`OK, switching ${devices} ${status}. Do you want more?`)
            break;

        // case 'lamp':
        //     var emitData = { deviceId : '8f780bcd-2a48-4cc4-baab-0a277e0710ab', action : status, data : 'lamp' };
        //     socketio.emitMessage(socketId, emitData);
        //     conv.ask(`OK, switching ${devices} ${status}. Do you want more?`)
        //     break;
        default: console.log('No devices')

      }
			conv.ask(new Suggestions(intentSuggestions));
});
// app.intent('Get_state_of_device', async (conv, {status, devices} ) => {
//
// }
app.intent('Get weather', async (conv, {weather_location, weather} ) => {
  if (weather_location == 'kitchen station') {
        var kitchenSensorId = "b6995ae2-8ec6-4747-ab4d-e3ca4bb0ffd0";
        if (weather == 'temperature') {
            getKitchenDataTemp = await getTemperature.getTemp(kitchenSensorId);
            kitchenDataTemp = getKitchenDataTemp.data;
            conv.ask(`OK, kitchen temperature is ${kitchenDataTemp} Celcius degree. Do you want more?`);
        }
        if (weather == 'humidity') {
            getKitchenDataHumid = await getTemperature.getHumid(kitchenSensorId);
            kitchenDataHumid = getKitchenDataHumid.data;
            conv.ask(`OK, kitchen humidity is ${kitchenDataHumid} percentage. Do you want more?`);
        }
  }
  if (weather_location == 'bedroom station') {
        var bedroomSensorId = "b946e23b-33f9-43d5-8cd1-f1d04df9b394";
        if (weather == 'temperature') {
            getBedroomDataTemp = await getTemperature.getTemp(bedroomSensorId);
            bedroomDataTemp = getBedroomDataTemp.data;
            conv.ask(`OK, bedroom temperature is ${bedroomDataTemp} Celcius degree. Do you want more?`);
        }
        if (weather == 'humidity') {
            getbedroomDataHumid = await getTemperature.getHumid(bedroomSensorId);
            bedroomDataHumid = getbedroomDataHumid.data;
            conv.ask(`OK, bedroom humidity is ${bedroomDataHumid} percentage. Do you want more?`);
        }
  }
});

module.exports = app;
//exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
