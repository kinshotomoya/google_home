// queue(redis)からmessageを取得して、google_homeに送信する
// loop doで、常に回すことで、redisからデータを取得する
require('dotenv').config();
require('date-utils');
var connection = require('./mysql_config.js');
const redis = require('redis');
const client = redis.createClient();
const google_home = require('google-home-notifier');
const language = 'ja';

var sentMessege = (message) => {
	let lineUserId = JSON.parse(message).events[0].source.userId;
	connection.query(`select * from users where line_id = "${lineUserId}"`, (err, rows, results) => {
		let user_name = rows[0].name
		let user_id = rows[0].id
		let firstSentence = `${user_name}からのメッセージです。`;
		let send_message = JSON.parse(message).events[0].message.text;
		postMessage(user_id, send_message);
		let all_send_message = firstSentence + send_message;
		google_home.device('Google-Home', language);
		google_home.notify(all_send_message, (res) => {
			console.log(res);
		});
	});
};

var postMessage = (user_id, send_message) => {
	var now = new Date();
	var now_date = now.toFormat('YYYY-MM-DD HH24:MI:SS')
	console.log(now_date)
	connection.query(`insert into messsages(user_id, text, created_at, updated_at) values(${user_id}, "${send_message}", "${now_date}", "${now_date}")`)

	connection.end();
}


setInterval(() => {
	// 時間をconsoleで出力する
	// redis(queue)から、一個づつmessageを取り出す
	// (-1, -1)は、リストの最後の値を指定している
	client.lrange('linedata', -1, -1, (err, list_message) => {
		message = list_message[0];
		if (!message) {
			// messagesがない時の処理をする
			console.log('messageはありません');
			return;
		};
		client.lrange('linedata', 0, -1, (err, all_message_list) => {

			console.log(all_message_list);
			console.log(all_message_list.length);
			// 取り出した値（リストの最後の値）をリストから削除する
			// 下の例の場合には、["a", "b", "c", "d"] "a", "b", "c"を残して、その他（"d"）を削除するという意味
			// ex) client.ltrim('linedata', 0, 2);
			if (all_message_list.length == 1) {
				client.del('linedata');
			} else {
				client.ltrim('linedata', 0, all_message_list.length - 2);
			}
		})
		sentMessege(message);
	})
}, 7000);
