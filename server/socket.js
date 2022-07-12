const webSocket = require('ws');
const event = require('events');

class socketConnection extends event{
    constructor({server}){
        super();

        this.socket = new webSocket.Server({server});
        this.client_socket = Object.create(null);

        this.socket.on('connection',client => {
            client.isAlive = true;
            let id = Math.floor(Math.random() * 666);
            this.client_socket[id] = client;

            client.on('message',data => {
                this.emit('command',data,id)
            })

            client.on('close', () => {
                delete this.client_socket[id]
            })
        })
    }

    send(id,msg){
        this.client_socket[id].send(JSON.stringify(msg));
    }
}

module.exports = socketConnection;