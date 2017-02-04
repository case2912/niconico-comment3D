var request = require('request');
var cheerio = require('cheerio');
var net = require('net');

var nicolive = {
    login: function(id, pw, callback) {
        request.post({
            url: 'https://secure.nicovideo.jp/secure/login',
            form: {
                mail_tel: id,
                password: pw,
            },
        }, function(error, response) {
            if (error != null) return callback(error);

            var session = null;
            var cookies = response.headers['set-cookie'] || [];
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                if (cookie.match(/^user_session=user_session/)) {
                    session = cookie.slice(0, cookie.indexOf(';') + 1);
                }
            }
            if (session == null) return callback(new Error('Invalid user'));

            callback(null, session);
        });
    },
    fetchThread: function(live_id, session, callback) {
        request({
            url: 'http://live.nicovideo.jp/api/getplayerstatus/' + live_id,
            headers: {
                Cookie: session,
            },
        }, function(error, response) {
            if (error != null) return callback(error);

            var $ = cheerio.load(response.body);
            callback(null, {
                port: $('getplayerstatus ms port').text(),
                addr: $('getplayerstatus ms addr').text(),
                thread: $('getplayerstatus ms thread').text(),
            });
        });
    },
    view: function(thread, callback) {
        var viewer = net.connect(thread.port, thread.addr);
        viewer.on('connect', function() {
            viewer.setEncoding('utf-8');
            viewer.write('<thread thread="' + thread.thread + '" res_from="0" version="20061206" />\0');

            callback(null, viewer);
        });
    },
}

module.exports = nicolive;