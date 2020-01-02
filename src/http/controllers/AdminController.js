var adminService = require("../services/AdminService");
var smarthomeUserService = require("../services/SmarthomeUserService");
var userService = require("../services/UserService");
const uuidv4 = require('uuid/v4');
module.exports = {
  new_admin : async function (req, res) {
      console.log("HTTP POST Request");
      var admin_id = uuidv4();
      var adminData = { admin_id: admin_id, name : req.body.name, password: req.body.password, email : req.body.email, phone : req.body.phone,
          gender : req.body.gender, date_of_birth : req.body.date_of_birth };
      var create_admin = await adminService.add_admin(adminData, admin_id);
      console.log(create_admin);
      if (create_admin.status) {
          return res.status(200).json({ success: true, message: create_admin.message });
      }
      return res.status(400).json({ success: false, message: create_admin.message});
  },
  admin_by_id : async function(req, res) {
      console.log("HTTP GET Request");
      var adminId = req.params['id'];
      var get_by_id = await adminService.admin_by_id(adminId);
      console.log(get_by_id.message);
      if (get_by_id.status) {
           return res.status(200).json({ success : true, message : get_by_id.message, data : get_by_id.data});
       }
      return res.status(400).json({ success : false, message : get_by_id.message});
  },
  change_setting_user: async function(req, res) {
    var userDataForSetting = req.body;
    userId = userDataForSetting.user_id;
    var getSmarthomeUser = await smarthomeUserService.getSmartHomeUserByUserId(userId);
    if (!getSmarthomeUser.status) {
      //return res.status(400).json({ success : false, message : getSmarthomeUser.message});
      userHadSmarthomeUser = getSmarthomeUser.status;
      smarthomeUserData = '';
    } else {
      userHadSmarthomeUser = getSmarthomeUser.status;
      smarthomeUserDataKey = getSmarthomeUser.data;
      var smarthomeUserData = smarthomeUserDataKey[Object.keys(smarthomeUserDataKey)[0]];
      //smarthomeUserData = getSmarthomeUser.data;
    }
    //console.log('userDataForSetting:', userDataForSetting);
    var changeSettingUser = await adminService.change_setting_user(userDataForSetting, userHadSmarthomeUser, smarthomeUserData);
    console.log(changeSettingUser);
    if (!changeSettingUser.status) {
      return res.status(400).json({ success : false, message : changeSettingUser.message});
    }
    return res.status(200).json({ success : true, message : changeSettingUser.message});
  },
  update_user : async function(req, res) {
      console.log("HTTP PUT Request");
      //var userId = req.params['id'];
      //var currentUserData = req.session.userData;
      //console.log("currentXXXXXXX:", currentUserData);
      //console.log("data2Update:", req.body);
      //var updateUserData = req.body;
      // if ((updateUserData.name == currentUserData.name && updateUserData.email == currentUserData.email &&
      // updateUserData.phone == currentUserData.phone && updateUserData.date_of_birth == currentUserData.date_of_birth)){
      //   return res.status(400).json({ success: false, message:"Nothing changed in User Profile"});
      // }
      //console.log('xxxxx--------------------------');
      // currentUserData.name = updateUserData.name;
      // currentUserData.email = updateUserData.email;
      // currentUserData.phone = updateUserData.phone;
      // currentUserData.date_of_birth = updateUserData.date_of_birth;
      var userDataToUpdate = req.body;
      // var userData = { user_id: user_id, name : req.body.name, password: req.body.password, email : req.body.email, phone : req.body.phone,
      //     gender : req.body.gender, date_of_birth : req.body.date_of_birth, created_at : req.body.created_at };
      var update_user = await userService.update_user(userDataToUpdate.user_id, userDataToUpdate);
      //console.log(update_user);
      if (update_user.status) {
          return res.status(200).json({ success: true, message: update_user.message });
      }
      return res.status(400).json({ success: false, message: update_user.message});
  },
}
