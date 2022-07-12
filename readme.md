# Whatsapp Bot

Simple Whatsapp bot multi device based on **[whatsapp-web.js](https://wwebjs.dev/)** and multi client using websocket

## Getting Started

### Install

Clone this project

```bash
> git clone https://github.com/dimelang/whatsapp-bot.git
> cd whatsapp-bot
```

Install the dependecies (server):

```bash
> cd server
> npm install
```

### Usage

Run whatsapp bot 

server :

```bash
> npm start
```

client :

> You can manage your Whatsapp bot by running index.html in the client directory

## To-Do

- Find and open main.js in client directory
- Edit code block on line 1 and 2:

    Configure __`socket`__,__`id_client`__:

    ```bash
    example

    const socket = new WebSocket('ws://ws://127.0.0.1:3000/');

    const id_client = 'myName_666';
    ```
- This is done to distinguish between the clients connected to the server.