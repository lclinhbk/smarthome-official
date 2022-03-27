var firebase = require('firebase');

module.exports = {
    connect : function() {
        io.on('connection', function(socket){
            console.log('a user connected with sid :' + socket.id);
            socketIdForEsp = socket.id;
            socket.emit('hey','hello esp8266');
            socket.on('disconnect', function(){
                console.log('user disconnected, sid :' + socket.id);
            });
        });
    },
    recievedSmartHomeId : function() {
         io.on('connection', function(socket){
            socket.on('smarthomeId', async function(msg){
                console.log('smarthomeId: ' + msg + '...sent from client :' + socket.id);
                var smarthomeReference = firebase.database().ref("/smarthomes/"+ msg);
                try {
                    return await smarthomeReference.update({"socketId" : socket.id}).then(
                        function(error) {
                            var response = null;
                            if (error) {
                                response =  { status: false, message: "SocketId could not be updated." + error };
                            }
                            else {
                                response =  { status: true, message: "SocketId updated successfully." };
                            }
                            return response;
                        });
                    } catch (e) {
                        throw Error(e.message);
                    }
            });

         });
    },
    emitMessage : function(socketId, emitData) {
         io.to(socketId).emit('hey', emitData);
    },
    loopMessageToEsp: function(socketId, emitData) {
        while (i < 100) {
            text += "The number is " + i;
            i++;
            io.to(socketId).emit('hey', text);
        }
        
        
    }
}
