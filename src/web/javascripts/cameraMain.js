const socket = io('https://webrtc-socket-server.herokuapp.com/');

//$('#div-chat').hide();
//$("#div-dang-ky").hide();


customConfig = {
    'iceServers': [
        { urls: ["stun:ss-turn2.xirsys.com"] },
        {
            username: "rL2EnrOEkSNVt_uEYABZ_Zd8Ys4V5kQZBs-VC5uGdGiA55wgAEr5RjfbDS_h-NesAAAAAF2csMVsY2xpbmg=",
            credential: "a6980e7c-e9e3-11e9-8a52-322c48b34491",
            urls: ["turn:ss-turn2.xirsys.com:80?transport=udp",
                "turn:ss-turn2.xirsys.com:3478?transport=udp",
                "turn:ss-turn2.xirsys.com:80?transport=tcp",
                "turn:ss-turn2.xirsys.com:3478?transport=tcp",
                "turns:ss-turn2.xirsys.com:443?transport=tcp",
                "turns:ss-turn2.xirsys.com:5349?transport=tcp"
            ]
        }
    ]
}

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    //$('#div-chat').show();
    //$('#div-dang-ky').hide();

    arrUserInfo.forEach(user => {
        const { ten, peerId, stt, firstCamId, firstCamTen } = user;
        var classForMainCam = '';
        if (stt == 1) {
            classForMainCam = "classForMainCam";
        }
        $('#ulUser').append(`<li id="${peerId}" class="${classForMainCam}">${ten}</li>`);
        //console.log(firstCamId+"nguoi dung cu");
         console.log('so thu tu arrUserInfo: '+stt);
        if (firstCamId && firstCamId != peerId ) {
            if ($("#" + firstCamId).length == 0 ) {
                $('#ulUser').append(`<li id="${firstCamId}" class="tu arrUserInfo">${firstCamTen}</li>`);
            }

            $("#"+firstCamId).click();
        }
    });

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerId, stt, firstCamId, firstCamTen } = user;
        var loadAgain = false;
        var classForMainCam = '';
        if (stt == 1 && $(".classForMainCam").length == 0) {
           loadAgain = true;
            classForMainCam = "classForMainCam";
        }

        $('#ulUser').append(`<li id="${peerId}" class="${classForMainCam}">${ten}</li>`);
        //console.log(peerId+"nguoi dung moi");
        console.log('so thu tu CO_NGUOI_DUNG_MOI: '+stt);
        console.log($('#ulUser').children().length);
        console.log($("#ulUser li").length +'2222');

        if ((firstCamId && firstCamId != peerId) || loadAgain) {
            console.log(123);
            if ($("#" + firstCamId).length == 0 ) {
               $('#ulUser').append(`<li id="${firstCamId}" class="tu CO_NGUOI_DUNG_MOI">${firstCamTen}</li>`);
            }
            $("#"+firstCamId).click();
        }
    });

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('DANG_KY_THAT_BAT', () => alert('Vui long chon username khac!'));


function openStream() {
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    if (!video) {
        return false;
    }
    video.srcObject = stream;
    video.play();
}



const peer = new Peer({
    key: 'peerjs',
    host: 'peerjs-server-lclinh.herokuapp.com',
    secure: true,
    port: 443,
    config: customConfig
});

peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id, stt: 0, firstCamId: "", firstCamTen: ""  });
    });
});

//Caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});

//Callee
peer.on('call', call => {
    openStream()
    //getNoMedia()
        .then(stream => {
            call.answer(stream);
            //playStream('localStream', stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});

// $('#ulUser').on('click', 'li', function() {
//     const id = $(this).attr('id');
//     console.log(id);
//     openStream()
//         .then(stream => {
//             playStream('localStream', stream);
//             const call = peer.call(id, stream);
//             call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
//         });
// });
const createEmptyVideoTrack = ({ width, height }) => {
    const canvas = Object.assign(document.createElement('canvas'), { width, height });
    canvas.getContext('2d').fillRect(0, 0, width, height);

    const stream = canvas.captureStream();
    const track = stream.getVideoTracks()[0];
    return Object.assign(track, { enabled: false });
};

$('#ulUser').on('click', 'li', function() {
    const id = $(this).attr('id');
    console.log(id);

    const stream = new MediaStream([createEmptyVideoTrack({ width: 400, height: 300 })]);
    const call = peer.call(id, stream);
    call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
 });

$( document ).ready(function() {
  // Handler for .ready() called.

    var randomN = $.now();
    $("#txtUsername").val("linh"+randomN);
    setTimeout(function() {
        console.log(234);
        $("#btnSignUp").trigger('click');
    }, 2500);
});
