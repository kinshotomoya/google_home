const http = require('http');
require('dotenv').config();
const google_home = require('google-home-notifier');
const language = 'ja';

var server = http.createServer();

// 3000ポートで待ち受けして、受け入れ先
server.on('request', (req, res) => {
    req.on('data', (message) => {
        console.log(JSON.parse(message).events[0].message.text);
        let send_message = JSON.parse(message).events[0].message.text;
        google_home.ip('sssss', language);
        google_home.notify(send_message, (res) => {
            console.log(res);
        });
    })
})

server.listen(3000);
