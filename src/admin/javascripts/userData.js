let layListData = {};
let mangListData = [];
let indexVarForSetting = 0;
let indexVarForEdit = 0;
function loadDataUser()
{
    layListData = JSON.parse(document.body.dataset.layuserdata);
    let i = 0;
    for(let key in layListData)
    {
        mangListData[i] = layListData[key];
        i++;
    }
    console.log(mangListData);
}
// ************************************************
//Hàm loadBodyUser sẽ khởi chạy đầu tiên khi mở web
// ************************************************
function loadBodyUser()
{
    loadDataUser();
    createUserTb();
    doiSizeUser();
}
// ************************************************
// Hàm đọc data và tạo bảng
// ************************************************
function createUserTb()
{
let elemenTableBody = document.getElementsByTagName("tbody");
    mangListData.forEach(function(item,index) {
    let createRow = document.createElement('tr');
    createRow.innerHTML = "<td>"+ item.user_id + "</td>"+
    "<td>"+ item.name + "</td>"+
    "<td>"+ item.email + "</td>" +
    "<td>"+ item.smarthome_id + "</td>" +
    "<td>"+ item.smarthome_name + "</td>" +
    "<td>"+ item.active + "</td>" +
    "<td>" +
    '<i class="fas fa-cog" id="icon-setting" onclick="chagUser( '+ index +')"></i>'  +
    '<i class="far fa-edit" id="icon-edit" onclick="editUser( '+ index +')"></i>'  +
    '<i class="far fa-trash-alt" id="icon-trash" onclick="deleteUser( '+ index +')"></i>' +
    "</td>";
    elemenTableBody[0].append(createRow);
});
}
// ************************************************
// Xóa User
// ************************************************
function deleteUser(index)
{
    let txt = "";
    if (confirm("Bạn có chắc muốn xóa User : " +  mangListData[index].name))
      {
        try {
          axios.delete('/user/delete/' + mangListData[index].user_id)
            .then(function(response) {
              // handle success
              console.log(response.data);
              if (!response.data.success){
                return alert("Delete this user failed");
              }
              location.reload();
            })
            .catch(function(error) {
                // handle error
                // console.log(error);
                alert("Delete this user failed");
                console.log(error.response.data);
              });
        } catch(error){
          console.log(error);
        }
        txt = "OK bạn đã xóa User : " + mangListData[index].user_id;

      } else
      {
        txt = "Thoát ra";
      }
      console.log(txt);
}
// ************************************************
// Tìm kiếm
// ************************************************
function searchUser()
{
    let nameSearch = document.getElementById("id-search");
    let elemenTableBody = document.getElementsByTagName("tbody");

    console.log(nameSearch.children[0].value);
    for (let key of elemenTableBody[0].children) {
        let noiString = "";
        console.log(key.children.length -1);
        console.log(key);
        for(let i =0; i < (key.children.length -1) ; i++)
        {
            noiString += key.children[i].innerHTML + " ";
        }
        console.log(noiString);
        let kytuRegExp = new RegExp(nameSearch.children[0].value , 'i');
        // new RegExp cho phép ta dùng Regular Expression như 1 biến
        if(kytuRegExp.test(noiString))
        {
            key.style.display = "";
        }
        else if(nameSearch.children[0].value == '')
        {
            key.style.display = "";
        }
        else
        {
            key.style.display = "none";
        }
    }
}
// ************************************************
// Hàm hiện lên cửa sổ
// ************************************************
async function chagUser(index)
{
    indexVarForSetting = index;
    let smartHomeList = await axios.get('/smarthome/get_list');
    let smartHomeListData = smartHomeList.data.data;
    let mangsmartHomeListData = [];
    let i = 0;
    for(key in smartHomeListData)
    {
        mangsmartHomeListData[i] = smartHomeListData[key];
        i++;
    }
    //********************************************************* */
    let elementSelect = document.getElementById("luaChon");
    let tagOption = elementSelect.getElementsByTagName("option");
    for((tagOption.length - 1) ; (tagOption.length -1) >= 0; )
    {
    tagOption[(tagOption.length - 1)].remove();
    }

    for(let key of mangsmartHomeListData)
    {
        let elementSelect = document.getElementById("luaChon");
        let elementOption = document.createElement("option");
        if(mangListData[index].smarthome_name == key.name)
        {
            elementOption.innerHTML = "<option>" + key.name + "</option>";
            elementOption.selected = "true";
            elementOption.value = key.smarthome_id;
        }
        else
        {
            elementOption.innerHTML = "<option>" + key.name + "</option>";
            elementOption.value = key.smarthome_id;
        }
        elementSelect.append(elementOption);
    }
    let ktraActive = document.getElementById("actived");
    let elementInforUser = document.getElementById("info-user");
    let tagP = elementInforUser.getElementsByTagName("p");
    for((tagP.length - 1) ; (tagP.length -1) >= 0; )
    {
        tagP[(tagP.length - 1)].remove();
    }
    ktraActive.checked = mangListData[index].active
    {
        for(key in mangListData[index])
        {
            let showName = ["email","user_id","smarthome_name","smarthome_id",];
            let showName_1 = ["Email","User Id","Smart Home Name","Smart Home Id",];
            for(let i = 0; i < showName.length; i ++)
            {
                if(showName[i] == key)
                {
                    let createEleP = document.createElement("p");
                    createEleP.innerHTML = "<strong>" + showName_1[i] + " : " + "</strong>"  + mangListData[index][key];
                    elementInforUser.prepend(createEleP);
                }
            }
        }
        let createEleP = document.createElement("p");
        createEleP.innerHTML = "<strong>User Name : </strong>"  + mangListData[index].name;
        createEleP.style.textAlign = "center";
        createEleP.style.fontSize = "18px";
        elementInforUser.prepend(createEleP);
    }
    /******************************** */
    document.body.style.overflow = "hidden";
    document.getElementById("fix-block").style.display = "block";
}
// ************************************************
// Hàm nhận data sau khi ấn OK và đóng cửa sổ
// ************************************************
function accept_and_cls_User()
{
    console.log(mangListData[indexVarForSetting].active);
    let currentUserData = mangListData[indexVarForSetting];
    let par = document.getElementById("info-user");
    // let traVeActive = document.getElementById("check-active");
    /*********************************** */
    let laySelect = document.getElementById("luaChon");
    let smartHomeIdData;
    for(let key in laySelect.children)
    {
        if(laySelect.children[key].selected == true)
        smarthomeIdData = laySelect.children[key].value;
    }
    let traVeUserData = [];
    for(let key=0 ; key < (par.children.length-3); key++)
    {
        traVeUserData[key] = par.children[key].lastChild.nodeValue;
    }
    let userIdData = traVeUserData[3];
    let newActiveStatus = document.getElementById("actived").checked;
    if ( currentUserData.active == newActiveStatus && currentUserData.smarthome_id == smarthomeIdData) {
      return alert("Thông tin không thay đổi! Nhấn ESC để thoát...");
    }
    let settingData = { user_id : userIdData,
        current_user_data: currentUserData,
        current_smarthome_id : currentUserData.smarthome_id,
        new_smarthome_id: smarthomeIdData,
        current_active_status: currentUserData.active,
        new_active_status: newActiveStatus,
    };
    try {
    axios( {method: 'post', url:'/admin/change-setting-user', data: settingData }) //data: is BODY
      .then(function(response) {
        // handle success
        console.log(response.data);
        if (!response.data.success){
          return alert('Failed to change user setting');
        }
        location.reload();
      })
      .catch(function(error) {
        // handle error
        alert(error.response.data.message);
        console.log(error);
      });
  } catch (error) {
    alert('Failed to change user setting');
    console.log(error);
  }
    // console.log("OK xác nhận thông tin cho User");
    // console.log('smarthomeID vừa chọn:', smarthomeIdData);
    // console.log('userID cũ:', userIdData);
    // // let activeStatus = traVeActive.children[0].checked;
    // console.log('active Status:', document.getElementById("actived").checked);
    /************************************* */
    document.getElementById("fix-block").style.display = "none";
    document.body.style.overflow = "";
    //************************* */
}
// ************************************************
// Hàm thay đổi kích thước cửa sổ hiện lên theo kích thước window
// ************************************************
function doiSizeUser() {
    // console.log();
    if(window.innerWidth <= 768)
    {
       document.getElementById("fix-block").style.width = (window.innerWidth) +'px';
       document.getElementById("fix-block").style.left = "0";
       document.getElementById("fix-block-create-user").style.width = (window.innerWidth) +'px';
       document.getElementById("fix-block-create-user").style.left = "0";
       document.getElementById("fix-block-edit-user").style.width = (window.innerWidth) +'px';
       document.getElementById("fix-block-edit-user").style.left = "0";
       document.getElementById("wrapper-0").style.marginTop = "160px";
       document.getElementById("wrapper-0").style.height =  (window.innerHeight - 110) +"px";
       document.getElementById("wrapper-0").style.width =  (window.innerWidth ) +"px";
       document.getElementById("wrapper-0").style.marginLeft = "";
    }
    else
    {
    document.getElementById("fix-block").style.width = (window.innerWidth - 223) +'px';
    document.getElementById("fix-block").style.left = "223px";
    document.getElementById("fix-block-create-user").style.width = (window.innerWidth - 223) +'px';
    document.getElementById("fix-block-create-user").style.left = "223px";
    document.getElementById("fix-block-edit-user").style.width = (window.innerWidth - 223) +'px';
    document.getElementById("fix-block-edit-user").style.left = "223px";
    document.getElementById("wrapper-0").style.marginTop = "60px";
    document.getElementById("wrapper-0").style.marginLeft = "225px";
    document.getElementById("wrapper-0").style.height =  (window.innerHeight - 60) + "px";
    document.getElementById("wrapper-0").style.width =  (window.innerWidth - 225) + "px";
    }
}
function key_close_User(eve, accept_and_cls_User,accept_and_cls_newUser,accept_and_cls_editUser)
{
    if(eve.keyCode == 27 || eve.which == 27)
    {
        document.getElementById("fix-block").style.display = "none";
        document.getElementById("fix-block-create-user").style.display = "none";
        document.getElementById("fix-block-edit-user").style.display = "none";
        document.body.style.overflow = "";
    }
    else if(eve.keyCode == 13 || eve.which == 13)
    {
        if(document.getElementById("fix-block").style.display == "block")
        accept_and_cls_User();
        if(document.getElementById("fix-block-create-user").style.display == "block")
        accept_and_cls_newUser();
        if(document.getElementById("fix-block-edit-user").style.display == "block")
        accept_and_cls_editUser();
    }
}
// ************************************************
// Hàm Create New User
// ************************************************
function newUser()
{
    document.body.style.overflow = "hidden";
    document.getElementById("fix-block-create-user").style.display = "block";
}
function accept_and_cls_newUser()
{
    let checkGenderOk = document.getElementById("content-gender-user").getElementsByTagName("input");
    let valueGender = '';
    if(checkGenderOk[0].checked == true)
    {
        valueGender = checkGenderOk[0].value;
    }
    else if(checkGenderOk[1].checked == true)
    {
        valueGender = checkGenderOk[1].value;
    }
    else
    {
        valueGender = '';
    }
    // console.log("OK đã tạo User mới");
    // console.log("User Name:", document.getElementById("content-name-user").value);
    // console.log("User Email:", document.getElementById("content-email-user").value);
    // console.log("User Pass:", document.getElementById("content-password-user").value);
    // console.log("User Phone:", document.getElementById("content-phone-user").value);
    // console.log("User Birthday:", document.getElementById("content-birthday-user").value);
    // console.log("User Gender:", valueGender);
    let userName = document.getElementById("content-name-user").value;
    let email = document.getElementById("content-email-user").value;
    let password = document.getElementById("content-password-user").value;
    let phone = document.getElementById("content-phone-user").value;
    let birthday = document.getElementById("content-birthday-user").value;
    let gender = valueGender;
    if ( userName == '' || email == '' || password == '' || phone == '' || birthday == "" || gender == '') {
      return alert('Bạn đã nhập thiếu thông tin');
    }
    let d = new Date();

    let date = d.getDate();
    let month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    let year = d.getFullYear();

    let created_at = year + "-" + month + "-" + date;
    //document.write(dateStr);
    let userData = { name : userName, password : password, email : email, phone : phone, gender : gender,
        date_of_birth : birthday, created_at : created_at, updated_at : created_at};
    try {
    axios( {method: 'post', url:'/user/add', data: userData }) //data: is BODY
      .then(function(response) {
        // handle success
        console.log(response.data);
        if (!response.data.success){
          return alert('Failed to create new user');
        }
        location.reload();
      })
      .catch(function(error) {
        // handle error
        alert('Failed to create new user');
        console.log(error);
      });
  } catch (error) {
    alert('Failed to create new user');
    console.log(error);
  }
    document.getElementById("fix-block-create-user").style.display = "none";
    document.body.style.overflow = "";
}
// ************************************************
// Hàm Edit User
// ************************************************
function editUser(index)
{
    indexVarForEdit = index;
    let checkDate = document.getElementById("edit-birthday-user");
    checkDate.value = mangListData[index].date_of_birth;
    let checkGender = document.getElementById("edit-gender-user").getElementsByTagName("input");
    if(mangListData[index].gender == checkGender[0].value)
    {
        checkGender[0].checked = true;
    }
    else if(mangListData[index].gender == checkGender[1].value)
    {
        checkGender[1].checked = true;
    }
    else
    {
        checkGender[0].checked = false;
        checkGender[1].checked = false;
    }
    document.getElementById("edit-name-user").value = mangListData[index].name;
    document.getElementById("edit-phone-user").value = mangListData[index].phone;

    // ****************************************
    document.body.style.overflow = "hidden";
    document.getElementById("fix-block-edit-user").style.display = "block";
}
function accept_and_cls_editUser()
{
    // console.log("test-edit-user");
    // console.log(mangListData[indexVarForEdit]);
    var currentUserData = mangListData[indexVarForEdit];
    let checkGenderOk = document.getElementById("edit-gender-user").getElementsByTagName("input");
    let valueGender = '';
    if(checkGenderOk[0].checked == true)
    {
        valueGender = checkGenderOk[0].value;
    }
    else if(checkGenderOk[1].checked == true)
    {
        valueGender = checkGenderOk[1].value;
    }
    else
    {
        valueGender = '';
    }
    // console.log("OK đã chỉnh sửa User");
    // console.log("User Name:", document.getElementById("edit-name-user").value);
    // console.log("User Phone:", document.getElementById("edit-phone-user").value);
    // console.log("User birthday:", document.getElementById("edit-birthday-user").value);
    // console.log("User Gender:", valueGender);
    let userName = document.getElementById("edit-name-user").value;
    let userPhone = document.getElementById("edit-phone-user").value;
    let userBirthday = document.getElementById("edit-birthday-user").value;
    let userGender = valueGender;
    if (currentUserData.name == userName && currentUserData.phone == userPhone && currentUserData.date_of_birth == userBirthday &&
    currentUserData.gender == userGender) {
      return alert('Nothing changed in User Information');
    }
    //console.log("-----------------------xxxxxxxxxxxxxxxxx");
    currentUserData.name = userName;
    currentUserData.phone = userPhone;
    currentUserData.date_of_birth = userBirthday;
    currentUserData.gender = userGender;
    try {
      axios({
          method: 'post',
          url: '/admin/update-user',
          data: currentUserData
        }) //data: is BODY
        .then(function(response) {
          // handle success
          console.log(response.data);
          if (!response.data.success) {
            return alert(response.data.message);
          }
          //logout();
          location.reload();
          return alert("User Profile Updated Successfully");
        })
        .catch(function(error) {
          console.log(error);
          // document.getElementById("icon-ok").style.display = "none";
          // document.getElementById("fix-block-ok").style.display = "block";
          // document.getElementById("fix-block-cancel").style.display = "block";
          return alert(error.response.data.message);
        });
    } catch (error) {
      console.log(error);
      return alert('Failed to update user profile');
    }

    document.getElementById("fix-block-edit-user").style.display = "none";
    document.body.style.overflow = "";
}
// ************************************************
// Hàm Tắt cửa sổ cho Thiết bị di động
// ************************************************
function cancel_block()
{
    document.getElementById("fix-block").style.display = "none";
    document.getElementById("fix-block-create-user").style.display = "none";
    document.getElementById("fix-block-edit-user").style.display = "none";
    document.body.style.overflow = "";
}
