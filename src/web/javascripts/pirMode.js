function turnOnPir(){
  console.log("turnOnPir");
  let btnOnPir =document.getElementById('onPir');
  let pirDeviceId = btnOnPir.dataset.smarthomepiridon;
  console.log("pirDeviceId:", pirDeviceId);
  var actionData = {
      smarthome_device_id: pirDeviceId,
      //finger_id: smarthomeUser.finger_id,
      action: 'attach'
      //smarthomeUser_id: smarthomeUser_id //updated 07/01/2020
  };
  try {

  var doAction = axios({
      //headers: { 'uuid': req.session.uuid },
      method: 'post',
      url: "/smart-homes/devices/pirMode",
      data: actionData
  });
  //return res.status(200).json({ success: true, message: 'Successfully' });
}catch(error){
  console.log(error);
}
},
function turnOffPir(){
  console.log("turnOffPir");
  let btnOffPir =document.getElementById('offPir');
  let pirDeviceId = btnOffPir.dataset.smarthomepiridoff;
  console.log("pirDeviceId:", pirDeviceId);
  var actionData = {
      smarthome_device_id: pirDeviceId,
      //finger_id: smarthomeUser.finger_id,
      action: 'detach'
      //smarthomeUser_id: smarthomeUser_id //updated 07/01/2020
  };
  try {

  var doAction = axios({
      //headers: { 'uuid': req.session.uuid },
      method: 'post',
      url: "/smart-homes/devices/pirMode",
      data: actionData
  });
  //return res.status(200).json({ success: true, message: 'Successfully' });
}catch(error){
  console.log(error);
}
}
