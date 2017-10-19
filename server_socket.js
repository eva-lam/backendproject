var DJsync = require('./app.js').DJsync
var syncParty = require('./app.js').syncParty

module.exports = function (http, client, USER_INFO) {
    const ioo = require('socket.io')(http);
    

    var io = ioo.of('/djroom');
    io.on('connection', (socket) => {

        var current_room;

        //dj room creation and register DJ
        socket.on('new room', (room, program) => {
            socket.join(room, () => {
                let id_room_pair = Object.keys(socket.rooms); // [ <socket.id>, 'room 237' ]
                
                USER_INFO[id_room_pair[0].substring(8, id_room_pair[0].length)] = [id_room_pair[1], 'd', program];    //'d' is dj
                for (x in USER_INFO) { console.log(`dj info ${x} in room: ${USER_INFO[x]}`) }; // actual info

                current_room = USER_INFO[socket.id.substring(8, socket.id.length)][0];
                //current_room = user_room;

            })
            console.log(`A new DJ is creating a room and join ${current_room} in ${program}`);

            socket.emit('say', `hello, you joined ${current_room}`)

        });

        //client only join room
        socket.on('new client', (room, program) => {
            socket.join(room, () => {
                let id_room_pair = Object.keys(socket.rooms); // [ <socket.id>, 'room 237' ]
                USER_INFO[id_room_pair[0].substring(8, id_room_pair[0].length)] = [id_room_pair[1], 'c', program];
                for (x in USER_INFO) { console.log(`client info ${x} in room: ${USER_INFO[x]}`) }; // actual info

                current_room = USER_INFO[socket.id.substring(8, socket.id.length)][0];

                console.log('here is ' + current_room + ' ' + program)
            })
        })

        //'say' is one of the new socket for room
        socket.on('VIDEO', (msg) => {

            console.log(`DJ is trying to send this to client ${msg}`)
            io.to(current_room).emit('VIDEO', msg);
        });



        //console.log(`A client is connected from Chrome. Total list ${CLIENT_ID.length}`);
        socket.on('disconnect', () => {
            console.log(`DJ: ${socket.id.substring(8, socket.id.length)} is gone from Chrome. Room: ${USER_INFO[socket.id.substring(8, socket.id.length)]} is closed. Total list ${Object.keys(USER_INFO).length}`)
            delete USER_INFO[socket.id.substring(8, socket.id.length)]


        })

        //this 1 line will get the chat message from client
        socket.on(('chat message'), (msg) => {
            console.log(`message received: ${msg}`)
            //this line of code send the message back to client
            io.to(current_room).emit('chat message', msg);

        })

        socket.on(('CHECKING'), (msg) => {
            //console.log(`Check DJ time received: ${msg}`)
            //this line of code send the message back to client
            io.to(current_room).emit('CHECKING', msg);



        })

        socket.on('FIRE', (msg) => {
            console.log(`a client start/restart playing: ${msg}`)
            io.to(current_room).emit('FIRE', msg);

        });

        socket.on('sf_play', (date_info) => {
            console.log(`Sportify press DJ Resume/Play. Time: ${date_info}`)
            DJsync().then((dj_date_info)=>{
                lagtime = dj_data_info - dateinfo
                syncParty(lagtime)
            })
            io.to(current_room).emit('sf', 'confirmed a connection');
        })

        
        

    })


}