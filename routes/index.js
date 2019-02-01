var express = require('express');
var router = express.Router();


// google-home-botにtextを打つと、webhookでここで処理される
router.get('/line_webhook', (req, res, next) => {
    console.log('line_webhookです');
});


// google-home本体に「もう一度言って」というと、webhookでここで処理される
// IFTTTで設定
router.get('/say_again_webhook', (req, res, next) => {
    console.log('say_again_webhookです');
});

module.exports = router;
