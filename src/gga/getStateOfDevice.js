var firebase = require('firebase');

module.exports = {
  getStateOfDevice : async function(deviceId) {
              var smarthomeReference = firebase.database().ref("/smarthomeDevices/"+ deviceId +"/status");
              try {
                    return await smarthomeReference.once("value").then(
                               function(snapshot){
                                  return { status : true, message :"The read Device Status succeeded", data : snapshot.val()};
                                  console.log(snapshot.val())
                                  smarthomeReference.off("value");
                               },
                               function(errorObject){
                                  console.log("The read Device Status failed: " + errorObject.code);
                                  return { status : false, message : "The read Device Status failed: " + errorObject.code };
                               },
                    );
              }catch (e) {
                  throw Error(e.message);
              }
          },
}
