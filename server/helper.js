const fs = require('fs');
const WAbot = require('./bot');

let waClientList = {};

let json_path = './account.json';
let sessionPath = './.wwebjs_auth';

let isExist = () => {return fs.existsSync(json_path)};

let isEmpty = () => {return fs.statSync(json_path).size == 0};

let writeJson = (data) => {fs.writeFileSync(json_path,data)};

let readJson = () => {return fs.readFileSync(json_path)};

let deleteAccount = (account) => fs.rmdirSync(account,{ recursive: true, force: true });

let jsonHandler = () => {
    let json_data = null;
    if(!isExist() || isEmpty()){
        writeJson(JSON.stringify({}))
    }
    json_data = readJson();
    return JSON.parse(json_data)
}

let currenthandler = () => {
    let json_data = jsonHandler();
    Object.keys(json_data).forEach(id_client => {
        if(id_client in waClientList == false){
            Object.assign(waClientList,{[id_client]:{}});
        }

        Object.keys(json_data[id_client]).forEach(account => {
            if(account in waClientList[id_client] == false){
                Object.assign(waClientList[id_client],{
                    [account]:new WAbot(`${id_client}-${account}`)
                })
            }
        })

    })
    
}

let jsonCurrentHandler = (data) => {
    let json_data = jsonHandler()
    let cmd = Object.keys(data)[0];
    let id_client = Object.keys(data[cmd])[0];
    let account = Object .keys(data[cmd][id_client])[0]
    if(id_client in json_data){
        if(account in json_data[id_client] == false){
            Object.assign(json_data[id_client],data[cmd][id_client])
        }
        if(cmd == 'connect'){
            json_data[id_client][account]['connection']=true;
        }
    }else{
        Object.assign(json_data,data[cmd])
    }
    writeJson(JSON.stringify(json_data));
}


let initializeHandler = (id_client,id_connection,socket) => {
    currenthandler();
    let json_data = jsonHandler();
    let data = {};
    if(id_client in json_data){
        Object.keys(json_data[id_client]).forEach(account=>{
            Object.assign(data,{
                'starting':{
                    [account]:json_data[id_client][account]
                }
            })
            socket.send(id_connection,data)
            if(json_data[id_client][account]['connection'] == true){
                if(waClientList[id_client][account]['client']['_eventsCount'] != 0){
                    waClientList[id_client][account].restart();
                    waClientList[id_client][account] = new WAbot(`${id_client}-${account}`);
                }
                waClientList[id_client][account].connectClient(id_connection,socket);
                waClientList[id_client][account].listenMessage();
            }
        })
    }
}


let startingHandler = (id_connection,data,socket) => {
    let cmd = Object.keys(data)[0];
    let id_client = null
    if(typeof data[cmd] == 'string'){
        id_client = data[cmd]
        initializeHandler(id_client,id_connection,socket);
    }else{
        jsonCurrentHandler(data)
        currenthandler();
    }
}

let connectingHandler = (id_connection,data,socket) => {
    currenthandler();
    let cmd = Object.keys(data)[0];
    let id_client = Object.keys(data[cmd])[0];
    let account = Object.keys(data[cmd][id_client])[0]
    waClientList[id_client][account].connectClient(id_connection,socket);
    waClientList[id_client][account].listenMessage();
}

module.exports = {
    starting:(id_connection,data,socket) => {
        startingHandler(id_connection,data,socket);
    },

    connect:(id_connection,data,socket) => {
        jsonCurrentHandler(data)
        connectingHandler(id_connection,data,socket);

    },

    delete:(id_connection,data,socket) => {
        let json_data = readJson();
        json_data = JSON.parse(json_data);
        
        let cmd = Object.keys(data)[0];
        let id_client = Object.keys(data[cmd])[0];
        let account = Object.keys(data[cmd][id_client])[0];

        if(waClientList[id_client][account]['client']['_eventsCount'] != 0){
            waClientList[id_client][account].disconnectingClient(id_connection,socket);
        }
        delete waClientList[id_client][account];
        delete json_data[id_client][account];
        
        Object.keys(json_data).forEach((val,index)=>{
            if(Object.keys(json_data[val]).length == 0){
                delete json_data[val];
            }
        })
        writeJson(JSON.stringify(json_data));
        
        socket.send(id_connection,{
            'Delete':account
        });
        deleteAccount(`${sessionPath}/session-${id_client}-${account}`);
    },

    disconnect:(id_connection,data,socket) => {
        let json_data = readJson();
        json_data = JSON.parse(json_data);

        let cmd = Object.keys(data)[0];
        let id_client = Object.keys(data[cmd])[0];
        let account = Object.keys(data[cmd][id_client])[0];
        json_data[id_client][account]['connection']=false;
        writeJson(JSON.stringify(json_data));
        waClientList[id_client][account].disconnectingClient(id_connection,socket);
        waClientList[id_client][account] = new WAbot(`${id_client}-${account}`);
        // exec("pm2 stop BotWA");
        // exec("proccess.sh")
    }
}