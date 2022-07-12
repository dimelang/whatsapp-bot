const replyHandler = (incoming) => {
    if(incoming == 'ping'){
        return 'pong'
    }else if(incoming == 'pong'){
        return 'ping'
    }
}

module.exports = {replyHandler}