var userService = require("../services/UserService");
const uuidv4 = require('uuid/v4');
module.exports = {
    user_list : async function(req, res, next) {
        console.log("HTTP GET Request");
        var get_list_user = await userService.get_list();
        console.log(get_list_user.data);
        // var count = Object.keys(get_list_user.data).length;
        // console.log(count);
        if (get_list_user.status) {
             return res.status(200).json({ success : true, message : get_list_user.message, data : get_list_user.data});
         }
        return res.success(400).json({ success : false, message : get_list_user.message});
    },
    new_user : async function (req, res) {
        console.log("HTTP POST Request");
        var user_id = uuidv4();
        //console.log(body);
        var userData = { user_id: user_id,
            name : req.body.name, password: req.body.password,
            email : req.body.email, phone : req.body.phone,
            gender : req.body.gender, date_of_birth : req.body.date_of_birth,
            created_at : req.body.created_at, active : false,
            updated_at : req.body.updated_at };
        console.log(userData);
        var create_user = await userService.add_user(userData, user_id);
        console.log(create_user);
        if (create_user.status) {
            return res.status(200).json({ success: true, message: create_user.message });
        }
        return res.status(400).json({ success: false, message: create_user.message});
    },
    user_by_id : async function(req, res) {
        console.log("HTTP GET Request");
        var userId = req.params['id'];
        var get_by_id = await userService.user_by_id(userId);
        console.log(get_by_id);
        if (get_by_id.status) {
             return res.status(200).json({ success : true, message : get_by_id.message, data : get_by_id.data});
         }
        return res.success(400).json({ success : false, message : get_by_id.message});
    },
    update_user : async function(req, res) {
        console.log("HTTP PUT Request");
        //var userId = req.params['id'];
        var currentUserData = req.session.userData;
        //console.log("currentXXXXXXX:", currentUserData);
        //console.log("data2Update:", req.body);
        var updateUserData = req.body;
        if ((updateUserData.name == currentUserData.name && updateUserData.email == currentUserData.email &&
        updateUserData.phone == currentUserData.phone && updateUserData.date_of_birth == currentUserData.date_of_birth)){
          return res.status(400).json({ success: false, message:"Nothing changed in User Profile"});
        }
        //console.log('xxxxx--------------------------');
        currentUserData.name = updateUserData.name;
        currentUserData.email = updateUserData.email;
        currentUserData.phone = updateUserData.phone;
        currentUserData.date_of_birth = updateUserData.date_of_birth;
        var userDataToUpdate = currentUserData;
        // var userData = { user_id: user_id, name : req.body.name, password: req.body.password, email : req.body.email, phone : req.body.phone,
        //     gender : req.body.gender, date_of_birth : req.body.date_of_birth, created_at : req.body.created_at };
        var update_user = await userService.update_user(userDataToUpdate.user_id, userDataToUpdate);
        //console.log(update_user);
        if (update_user.status) {
            return res.status(200).json({ success: true, message: update_user.message });
        }
        return res.status(400).json({ success: false, message: update_user.message});
    },
    delete_user : async function(req, res) {
        console.log("HTTP DELETE Request");
        var userId = req.params['id'];
        var delete_user = await userService.delete_user(userId);
        console.log(delete_user);
        if (delete_user.status) {
            return res.status(200).json({ success: true, message: delete_user.message });
        }
        return res.status(400).json({ success: false, message: delete_user.message});
    },
    change_password: async function(req, res) {
      let currentPassword = req.body.currentPassword;
      let newPassWord = req.body.newPassWord;
      let userId = req.session.userData.user_id;
      console.log("currentPassword:", currentPassword);
      console.log("newPassWord:", newPassWord);
      console.log("userId:", userId);
      let changePasswordData = await userService.change_password(currentPassword, newPassWord, userId);
      //console.log("x1:", changePasswordData);
      if (!changePasswordData.status) {
        return res.status(400).json({ success: false, message: changePasswordData.message });
      }
      return res.status(200).json({ success: true, message: changePasswordData.message });
      // let getUserData = await userService.user_by_id(userId);
      // //console.log("userData:", getUserData);
      // var passwordsMatch = comparePassword(currentPassword, getUserData.data.password);
      // if(!passwordsMatch) {
      //    return { status: false, message: 'Invalid email & password.' };
      // }
      // console.log("XXXXXXXXXX");
    },
}
