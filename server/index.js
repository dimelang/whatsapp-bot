const express = require('express');
const http = require('http');
const webSocket = require('./socket');
const helper = require('./helper');


const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

const socket = new webSocket({server});


socket.on('command',(data,id_connection,whatsapp) => {
    data = JSON.parse(data);
    let cmd = Object.keys(data)[0];

    switch(cmd){
        case 'starting':
            helper.starting(id_connection,data,socket);
            break;
        case 'connect':
            helper.connect(id_connection,data,socket);
            break;
        case 'disconnect':
            helper.disconnect(id_connection,data,socket);
            break;
        case 'delete':
            helper.delete(id_connection,data,socket);
            break;
    }
})

server.listen(PORT)