// lineからのwebhookを受け付ける処理をする
const http = require('http');
const redis = require('redis');
const client = redis.createClient();


var server = http.createServer();

var saveMessage = function(message) {
    client.lpush('linedata', message);
}


server.on('request', (req, res) => {
    req.on('data', (message) => {
        saveMessage(message);
    })
})

server.listen(3000);
