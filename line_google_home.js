const http = require('http');
const google_home = require('google-home-notifier');
const language = 'ja';

var server = http.createServer();

// 3000ポートで待ち受けして、受け入れ先
server.on('request', (req, res) => {
    req.on('data', (message) => {
        let userId = JSON.parse(message).events[0].source.userId;
        if (userId == "Uaacd580dab2c95d8d7b907c76ea625b7") {
            var userName = 'トモヤからのメッセージです。';
        } else if (userId == 'U362a6c43831faaf200e8ef4daea3f3e6') {
            userName = "ママからのメッセージです。";
        } else if (userId == 'Uf8133ed6ed6dc6b34d8646ba33de303f') {
            userName = 'ななからのメッセージです。'
        } else if (userId == 'Ub8e48bbd0b4dea8ea0f6984a8ea0bfa2') {
            userName = 'いくやからのメッセージです。'
        } else if (userId == 'U99a4a2253412238a0b510cacd34d39ff') {
            userName = 'みみからのメッセージです。'
        };
        console.log(userName);
        console.log(JSON.parse(message).events[0].source.userId);
        let send_message = JSON.parse(message).events[0].message.text;
        send_message = userName + send_message;
        google_home.device('Google-Home', language);
        google_home.notify(send_message, (res) => {
            console.log(res);
        });
    })
})

server.listen(3000);
