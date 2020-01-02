var Users = require("./../models/Users");

module.exports = {

    add_user : async function(userData, user_id) {
        return await Users.add_user(userData, user_id);
    },
    get_list : async function() {
        return await Users.get_list();
    },
    user_by_id : async function(userId) {
        return await Users.user_by_id(userId);
    },
    update_user : async function(userId,userData) {
        return await Users.update_user(userId,userData);
    },
    delete_user : async function(userId) {
        return await Users.delete_user(userId);
    },
    register : async function(userData) {
        try {
            var getUser = await Users.getUserByEmail(userData.email);

            if (getUser.status && getUser.data) {
                return { status: false, message: 'This email is already taken.', data: null };
            }

            var isSuccess = await Users.register(userData);
            if (!isSuccess.status) {
                return { status: false, message: 'Can not register user.', data: isSuccess.message };
            }

            return { status: true, message: 'Successfully.', data: isSuccess.data };
        } catch (e) {
            throw Error(e.message);
        }
    },
    change_password: async function(currentPassword, newPassWord, userId){
      try {
        var changePasswordData = await Users.change_password(currentPassword, newPassWord, userId);
        if (!changePasswordData.status){
          return { status: false, message: changePasswordData.message};
        }
        return { status: true, message: changePasswordData.message};
      }catch(e) {
          return { status: false, message: changePasswordData.message};
          throw Error(e.message);
      }
    },

    login : async function(loginData) {
        try {
            var getUser = await Users.getUserByEmail(loginData.email);
            if (getUser.status && getUser.data) {
                var UserData = getUser.data;
                var userContent = UserData[Object.keys(UserData)[0]];
              if (userContent.active) {
                var user = await Users.login(loginData, UserData);
                if (user.status) {
                return {status : true, message : user.message, user : user.user};
                }
                return {status : false, message : user.message};
              }
            return {status : false, message : 'Account is not Activated'};
          }
            return {status : false, message : 'Email not exist'};
        }catch(e) {
            throw Error(e.message);
        }
    },
    // add logout 17-10-2019
    logout: async function(uuid) {
        try {
            return await Users.logout(uuid);
        } catch (e) {
            throw Error(e.message);
        }
    },

}
