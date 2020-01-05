const axios = require('axios');
const constants = require('../constants');

const viewPath = '../src/web/views';

module.exports = {
    index: async function (req, res, next) {
        var userName = '';
        if (req.session.signed) {
            userName = req.session.userData.name;
        }
        res.render(viewPath + '/index.ejs', { page: 'Home', menuId: 'home', userName : userName });
    },
    // camera: async function (req, res, next) {
    //
    //   res.render(viewPath + '/camera/camera.ejs');
    // },
    error: async function (req, res, next) {
        res.render(viewPath + '/error.ejs', { page: 'Error', menuId: '', message: 'Empty response.' });
    },
    cameraPage: async function (req, res, next) {
      if(req.session.signed) {
        res.render(viewPath + '/camera/camera.ejs', { page: 'Camera IP', menuId: 'camera', userName: req.session.userData.name });

        }
        else {
          res.render(viewPath + '/error.ejs', { page: 'Login', menuId: 'login', userName: '' });
        }

    },

    loginPage: async function (req, res, next) {
        res.render(viewPath + '/login/index.ejs', { page: 'Login', menuId: 'login', userName: '' });
    },
    signUpPage: async function (req, res, next) {
        res.render(viewPath + '/login/SignUp.ejs', { page: 'SignUp', menuId: 'signUp', userName: '' });

    },
    signUp: async function (req, res, next) {
      try {
      var name = req.body.name;
      var email = req.body.email;
      var password = req.body.password;
      var response = await axios.post(constants.API_URI + '/auth/register', {
          name: name,
          password: password,
          email: email
      })
          .then(function (response) {
              console.log(response);
              if (!response.data.success) {
                  //errorSignUp.innerHTML = "Fail to Sign Up !!!";
                  return res.status(400).json({ success: false, message: 'Fail to Sign Up' });

              }
              // alert("Your request is sent. We will sent you an confirm email soon!");
              // window.location.assign("/loginPage");
              return res.status(200).json({ success: true, message: 'Signed Up Successfully' });




          })
          .catch(function (error) {

              // errorSignUp.innerHTML = "Fail to Sign Up!!!";
              // return res.status(400).json({ success: false, message: 'Fail to Sign Up' });
              console.log(error.response.data);
              return res.status(400).json({ success: false, message: error.response.data.message });
          });
          //console.log(response.message);
    }catch(error) {
      //console.log(error);
      return res.status(400).json({ success: false, message: 'Fail to Sign Up' });
    }
    },

    logOut: async function (req, res, next) {
        //console.log('hihihi');
        try {
            var response = await axios.get(constants.API_URI + '/auth/logout', { 'headers': { 'uuid': req.session.uuid } });
            if (!response.data.success) {
                return res.status(400).json({ success: response.data.success });
            }
            req.session.signed = !response.data.success;
            console.log('check-logout :' + response.data.success);
            return res.status(200).json({ success: response.data.success });
        } catch (error) {
            console.log(error);
        }
    },
    authencation: async function (req, res, next) {
        var email = req.body.user;
        var password = req.body.password;
        var response = await axios.post(constants.API_URI + '/auth/login', {
            email: email,
            password: password
        })
            .then(function (response) {
                if (!response.data.success) {
                    res.status(400).json({ success: false, message: response.data.message });
                }
                req.session.uuid = response.headers.uuid;
                req.session.userData = response.data.data;
                //console.log("xxxxxx:", req.session.userData);
                req.session.signed = true;
                //req.session.save();
                console.log('signed :' + req.session.signed);
                res.status(200).set('uuid', response.headers.uuid).json({ success: true, message: response.data.message });
            })
            .catch(function (error) {
                //console.log(error);
                res.status(400).json({ success: false, message: error.message });
            });
    },
    smartHomes: async function (req, res, next) {
        try {

            var ss = req.session;
            //console.log(Object.keys(ss).length);

            if (ss == undefined || !(Object.keys(ss).length - 1)) {
                return res.redirect(constants.API_URI + '/loginPage');
            }
            userId = ss.userData.user_id;
            //console.log("-----------");
            //console.log("userID for check:", userId);
            var getSmartHomeUser = await axios.get(constants.API_URI + '/smarthome_user/getByUserId/' + userId);
            //console.log(getSmartHomeUser.data.data);
            if (!getSmartHomeUser.data.success){
              return res.redirect(constants.API_URI + '/loginPage');
            }
            smarthomeUserData = getSmartHomeUser.data.data;
            var smarthomeUserContent = smarthomeUserData[Object.keys(smarthomeUserData)[0]];
            var smarthome_id = smarthomeUserContent.smarthome_id;
            //console.log("____________", smarthome_id);
            var getSmartHomeById = await axios.get(constants.API_URI + '/smarthome/get_by_id/' + smarthome_id, { headers: { 'uuid': ss.uuid } });
            if (!getSmartHomeById.data.success){
              return res.redirect(constants.API_URI + '/loginPage');
            }
            var smarthomeData = getSmartHomeById.data.data;
            //console.log("---------------", smarthomeData);
            var smarthomeDataAddKey = { [smarthome_id]: smarthomeData }; //add key for an Object
            //console.log(smarthomeDataAddKey);

            // var response = await axios.get(constants.API_URI + '/smarthome/get_list', { headers: { 'uuid': ss.uuid } });
            // if (!response.data.success) {
            //     res.redirect(constants.API_URI + '/error');
            // }
            //
            // res.render(viewPath + '/smart-homes/index.ejs', { page: 'SMART HOMES', menuId: 'smart_homes', userName : req.session.userData.name , smartHomeList: response.data.data });
            res.render(viewPath + '/smart-homes/index.ejs', { page: 'SMART HOMES', menuId: 'smart_homes', userName : req.session.userData.name , smartHomeList: smarthomeDataAddKey });
        } catch (error) {
            //console.error(error);
            res.redirect(constants.API_URI + '/loginPage');
        }
    },
    showAuthButton: async function (req, res, next) {
        try {
            var ss = req.session;
            //console.log(Object.keys(ss).length);

            if (ss == undefined || !(Object.keys(ss).length - 1)) {
                // return res.redirect(constants.API_URI + '/error');
                console.log('uuid undefinded');
            }

            // var response = await axios.get(constants.API_URI + '/checkSignedIn', { headers: { 'uuid': ss.uuid } });
            // console.log(response.data.success + 'middleware');
            return res.status(200).json({ signed : ss.signed});
        } catch (error) {
            console.log(error);
        }
    },
    detail: async function (req, res, next) {
        try {
            var ss = req.session;
            //console.log(Object.keys(ss).length);

            if (ss == undefined || !(Object.keys(ss).length - 1)) {
                return res.redirect(constants.API_URI + '/loginPage');
            }

            var smartHomeId = req.params['id'];
            req.session.smarthomeId = smartHomeId;

            var smartHome = await axios.get(constants.API_URI + '/smarthome/get_by_id/' + smartHomeId, { headers: { 'uuid': ss.uuid } });
            if (!smartHome.data.success) {
                res.redirect(constants.API_URI + '/loginPage');
            }

            var smartHomeDevices = await axios.get(constants.API_URI + '/smarthome_device/' + smartHomeId, { headers: { 'uuid': ss.uuid } });
            if (!smartHomeDevices.data.success) {
                res.redirect(constants.API_URI + '/loginPage');
            }
            //console.log('hahaha', smartHomeDevices.data.data);
            res.render(viewPath + '/smart-homes/detail.ejs', { page: 'SMART HOME DEVICES', menuId: 'smart_homes', userName : req.session.userData.name, smartHome: smartHome.data.data, smartHomeDevices: smartHomeDevices.data.data });
        } catch (error) {
            //console.error(error);
            res.redirect(constants.API_URI + '/loginPage');
        }
    },
    smartHomeUsers: async function (req, res, next) {
        try {
            var smarthomeDevice_id = req.params['id'];

            var response = await axios.get(constants.API_URI + '/smarthome_device/get_by_id/' + smarthomeDevice_id);
            if (!response.data.success) {
                res.redirect(constants.API_URI + '/error');
            }
            var smartHomeDevice = response.data.data;

            var response = await axios.get(constants.API_URI + '/smarthome_user/getBySmarthomeId/' + smartHomeDevice.smarthome_id);
            if (!response.data.success) {
                res.redirect(constants.API_URI + '/error');
            }

            var smartHomeUser = response.data.data;

            res.render(viewPath + '/fingers/users.ejs', { page: 'FINGER USERS', menuId: 'smart_homes', userName : req.session.userData.name,
              smartHomeUser: smartHomeUser, smartHomeDevice: smartHomeDevice,
              user_id: req.session.userData.user_id, smarthome_id: req.session.smarthomeId  });
        } catch (error) {
            console.error(error);
        }
    },
    doAction: async function (req, res, next) {
        try {
            var smarthomeDevice_id = req.body.smarthomeDevice_id;
            var smarthome_id = req.body.smarthome_id;
            var action = req.body.action;
            var ss = req.session;

            // var response = await axios.get(constants.API_URI + '/smarthome/get_by_id/' + smarthome_id);
            // if (!response.data.success) {
            //     res.redirect(constants.API_URI + '/error');
            // }
            // var smartHome = response.data.data;

            var response = await axios.get(constants.API_URI + '/smarthome_device/get_by_id/' + smarthomeDevice_id);
            if (!response.data.success) {
                res.redirect(constants.API_URI + '/error');
            }
            var smartHomeDevice = response.data.data;

            var updateSmartHomeDevice = axios({
                method: 'post',
                url: constants.API_URI + '/smarthome_device/update/' + smarthomeDevice_id,
                data: {
                    smarthome_id: smartHomeDevice.smarthome_id,
                    series_number: smartHomeDevice.series_number,
                    machine_type: smartHomeDevice.machine_type,
                    status: action,
                    updated_at: smartHomeDevice.updated_at,
                    created_at: smartHomeDevice.created_at,
                    name: smartHomeDevice.name,
                    data: smartHomeDevice.data
                }
            });

            var actionData = {
                smarthome_device_id: smarthomeDevice_id,
                action: action == 'active' ? 'on' : 'off'
            };

            var doAction = axios({
                // headers: { 'uuid': constants.DEMO_USER_TOKEN },
                headers: { 'uuid': ss.uuid },
                method: 'post',
                url: constants.API_URI + '/action',
                data: actionData
            });

            return res.status(200).json({ success: true, message: 'Successfully' });

        } catch (error) {
            return res.status(400).json({ success: false, message: error });
        }
    },
    changeBrightness: async function(req, res, next){
      try {
          var smarthomeDevice_id = req.body.smarthomeDevice_id;
          var smarthome_id = req.body.smarthome_id;
          var brightness = req.body.action;
          var ss = req.session;
          var actionData = {
              smarthome_device_id: smarthomeDevice_id,
              action: brightness
          };

          var doAction = axios({
              // headers: { 'uuid': constants.DEMO_USER_TOKEN },
              headers: { 'uuid': ss.uuid },
              method: 'post',
              url: constants.API_URI + '/action',
              data: actionData
          });

          return res.status(200).json({ success: true, message: 'Successfully' });

      } catch (error) {
          return res.status(400).json({ success: false, message: error });
      }
  },
    fingerAction: async function (req, res, next) {
        try {
            var smarthomeDevice_id = req.body.smarthomeDevice_id;
            var smarthomeUser_id = req.body.smarthomeUser_id;
            var action = req.body.action;

            var response = await axios.get(constants.API_URI + '/smarthome_user/get_by_id/' + smarthomeUser_id);
            if (!response.data.success) {
                res.redirect(constants.API_URI + '/error');
            }
            var smarthomeUser = response.data.data;

            var updateSmartHomeUser = axios({
                method: 'post',
                url: constants.API_URI + '/smarthome_user/update/' + smarthomeUser_id,
                data: {
                    smarthome_id: smarthomeUser.smarthome_id,
                    finger_id: 'Updating',
                    updated_at: smarthomeUser.updated_at,
                    created_at: smarthomeUser.created_at,
                    user_id: smarthomeUser.user_id,
                    rfid_id: smarthomeUser.rfid_id
                }
            });

            var actionData = {
                smarthome_device_id: smarthomeDevice_id,
                finger_id: smarthomeUser.finger_id,
                action: action
            };

            var doAction = axios({
                headers: { 'uuid': req.session.uuid },
                method: 'post',
                url: constants.API_URI + '/action',
                data: actionData
            });

            return res.status(200).json({ success: true, message: 'Successfully' });

        } catch (error) {
            return res.status(400).json({ success: false, message: error });
        }
    },
    webHook: async function (req, res, next) {
        try {
            const data = req.body;
            console.log(data);

            return res.json({
                speech: 'Something went wrong!',
                displayText: 'Something went wrong!',
                source: 'get-movie-details'
            });
        } catch (error) {
            console.error(error);
        }
    }
}
