var mysql = require('mysql');
var connect = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

module.exports = connect;
