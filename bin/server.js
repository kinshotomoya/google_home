var app = require('../app');

// 3000番ポートで待ち受け
var server = app.listen(3000, () => {
    console.log('server is listening to port' + server.address().port);
});
