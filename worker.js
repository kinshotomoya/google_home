// queue(redis)からmessageを取得して、google_homeに送信する
// loop doで、常に回すことで、redisからデータをworkerを設定できる。
require('dotenv').config();
const redis = require('redis');
const client = redis.createClient();
const google_home = require('google-home-notifier');
const language = 'ja';

var sentMessege = (message) => {
	let userId = JSON.parse(message).events[0].source.userId;
	if (userId == process.env.TOMOYA_LINE_ID) {
		var userName = 'トモヤからのメッセージです。';
	} else if (userId == process.env.MAMA_LINE_ID) {
		userName = "ママからのメッセージです。";
	} else if (userId == process.env.NANA_LINE_ID) {
		userName = 'ななからのメッセージです。'
	} else if (userId == process.env.IKUYA_LINE_ID) {
		userName = 'いくやからのメッセージです。'
	} else if (userId == process.env.MAMA_LINE_ID) {
		userName = 'みみからのメッセージです。'
	};
	let send_message = JSON.parse(message).events[0].message.text;
	send_message = userName + send_message;
	google_home.device('Google-Home', language);
	google_home.notify(send_message, (res) => {
		console.log(res);
	});
};


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
