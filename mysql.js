var connection = require('./mysql_config.js');

connection.connect();
connection.query(`select * from users where line_id = "Uaacd580dab2c95d8d7b907c76ea625b7"`, (err, rows, result) => {
    // console.log(rows[0])
    name = rows[0].name;
    connection.query(`insert into messsages(user_id, text, created_at, updated_at) values(1, "mmm", "2019-10-23", "2019-10-23")`)
    connection.end()
});
