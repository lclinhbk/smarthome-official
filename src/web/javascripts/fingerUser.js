function updateDate() {
  let d = new Date();

  let date = d.getDate();
  let month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  let year = d.getFullYear();

  let update_date = year + "-" + month + "-" + date;
  return update_date;
}
function resetThisFingerUser() {
  let btnRst = document.getElementById('resetThisFinger');
  console.log(btnRst.dataset.smarthomeuseridtoreset);
  let smarthomeUserId = btnRst.dataset.smarthomeuseridtoreset;
  finger_id = '';
  try {
    axios.post('/smarthome_user/update/' + smarthomeUserId, { finger_id: finger_id })
      .then(function(response) {
        // handle success
        console.log(response.data);
        if (!response.data.success){
          return alert("Reset this Smarthome user failed");
        }
        console.log(response.data.data);
        location.reload();
      })
      .catch(function(error) {
          // handle error
          // console.log(error);
          alert("Reset this Smarthome user failed");
          console.log(error.response.data);
        });
  } catch(error){
    console.log(error);
  }
}
function emptyFinger() {
console.log("---------------");
}
function identifyFinger(){
  console.log("indentifyFinger");
  let btnSearchFinger =document.getElementById('searchFinger');
  let fingerDeviceId = btnSearchFinger.dataset.fingerdeviceid;
  console.log("fingerDeviceId:", fingerDeviceId);
  var actionData = {
      smarthome_device_id: fingerDeviceId,
      //finger_id: smarthomeUser.finger_id,
      action: 'search',
      //smarthomeUser_id: smarthomeUser_id //updated 07/01/2020
  };
  try {

  var doAction = axios({
      //headers: { 'uuid': req.session.uuid },
      method: 'post',
      url: "/smart-homes/devices/finger-search",
      data: actionData
  });
  //return res.status(200).json({ success: true, message: 'Successfully' });
}catch(error){
  console.log(error);
}
}
function newUser() {
  let btnNewUser = document.getElementById('addNewUser');
  console.log(btnNewUser.dataset.userid);
  let user_id = btnNewUser.dataset.userid;
  let smarthome_id = btnNewUser.dataset.smarthomeid;
  var smarthomeUserData = {
    //smarthomeUser_id: smarthomeUser_id,
    user_id: user_id,
    smarthome_id: smarthome_id,
    finger_id: '',
    rfid_id: '',
    updated_at: updateDate(),
    created_at: updateDate()
  };
  try{
    axios( {method: 'post', url:'/smarthome_user/add', data: smarthomeUserData }) //data: is BODY
      .then(function(response) {
        // handle success
        console.log(response.data);
        if (!response.data.success){
          return alert('Failed to create new smarthome user');
        }
        location.reload();
      })
      .catch(function(error) {
        // handle error
        alert('Failed to create new smarthome user');
        console.log(error);
      });
    } catch (e) {
        throw Error(e.message);
    }
console.log('------------------');
console.log(smarthomeUserData);
}
