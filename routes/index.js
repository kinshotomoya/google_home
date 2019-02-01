var express = require('express');
var router = express.Router();
var connection = require('../mysql_config.js');
const redis = require('redis');
const client = redis.createClient();
const google_home = require('google-home-notifier');
const language = 'ja';



// google-home-botにtextを打つと、webhookでここで処理される
router.post('/line_webhook', (req, res, next) => {
    console.log('line_webhookです');
    // queueにmessageを積む
    client.lpush('linedata', req.body);
});


// google-home本体に「もう一回言って」というと、webhookでここで処理される
// IFTTTで設定
router.get('/say_again_webhook', (req, res, next) => {
    console.log('say_again_webhookです');
    // 最後の会話を取得するquery
    connection.connect();
    connection.query('select * from messsages where id = (select max(id) from messsages)', (err, row, results) => {
      // google-home-notifierで取得した会話を発する実装
      last_message = row[0].text
      google_home.device('Google-Home', language);
      google_home.notify(last_message, (res) => {
        console.log(res);
      });
    });
    connection.end()
});

module.exports = router;
