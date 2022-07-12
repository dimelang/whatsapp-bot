const {Client, LocalAuth} = require("whatsapp-web.js");
const qrcode = require('qrcode');
const {replyHandler} = require('./reply');

class WhatsappClient{
    constructor(id_client){
        this.id_client = id_client;
        this.client = new Client({
            authStrategy: new LocalAuth({clientId: this.id_client}),
            restartOnAuthFail: false,
            puppeteer: {
                headless: true,
                handleSIGINT: false,
                args: [
                    '--no-sandbox'
                ],
            },
            restartOnAuthFail:true,
            takeoverOnConflict:true,
            takeoverTimeoutMs:10
        })
        this.client.initialize();
    }
    
    connectClient(id_connection,socket){
        socket.send(id_connection,{'account':`${this.id_client.split("-")[1]}`});
        this.client.on('ready', () => {
            socket.send(id_connection,{'message':'Terhubung ke Whatsapp'});
        });

        this.client.on('authenticated', () => {
            socket.send(id_connection,{"message":'Berhasil mengautentifikasi'});
        });
        this.client.on('qr',(qr) => {
            const opts = {
                errorCorrectionLevel: 'H',
                type: 'terminal',
                quality: 0.95,
                margin: 1,
                color: {
                 dark: '#27576a',
                 light: '#FFF',
                },
            }
            qrcode.toDataURL(qr, opts, (err, url) => {
                socket.send(id_connection,{'message':'Scan me!'});
                socket.send(id_connection,{'data':url});
            });
        })
    
        this.client.on('auth_failure', function(session) {
            socket.send(id_connection,{'message':'Autentifikasi gagal, restart...'});
        });

        this.client.on('disconnected',()=>{
            this.client.destroy();
            socket.send(id_connection,{'account disconnect':`${this.id_client.split("-")[1]}`});
        })
    }
    
    listenMessage(){
        this.client.on('message', msg => {
            let incomingMsg = msg.body;
            let replyMsg = replyHandler(incomingMsg.toLocaleLowerCase());
            this.client.sendMessage(msg.from,replyMsg);
        })
    }

    disconnectingClient(id_connection,socket){
        this.client.logout().then(() => {
            socket.send(id_connection,{'account disconnect':`${this.id_client.split("-")[1]}`});
        })
    }

    restart(){
        this.client.destroy();
    }
}

module.exports = WhatsappClient;