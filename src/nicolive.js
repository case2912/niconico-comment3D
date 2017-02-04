import 'babel-polyfill'
import request from 'request';
import cheerio from 'cheerio';
import net from 'net';

export default class Nicolive {
    async login(id, pw) {
        return new Promise((resolve, reject) => {
            request.post({
                url: 'https://secure.nicovideo.jp/secure/login',
                form: {
                    mail_tel: id,
                    password: pw
                }
            }, (err, res) => {
                if (err) reject('login error!', err);
                let session = null;
                var cookies = res.headers['set-cookie'] || [];
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    if (cookie.match(/^user_session=user_session/)) {
                        session = cookie.slice(0, cookie.indexOf(';') + 1);
                    }
                }
                if (session === null) reject('login error!', err);
                resolve(session);
            });
        });
    }

    async feachThread(live_id, session) {
        return new Promise((resolve, reject) => {
            request({
                url: 'http://live.nicovideo.jp/api/getplayerstatus/' + live_id,
                headers: {
                    Cookie: session,
                },
            }, (err, res) => {
                if (err) reject('feath error!', err);
                var $ = cheerio.load(res.body);
                resolve({
                    port: $('getplayerstatus ms port').text(),
                    addr: $('getplayerstatus ms addr').text(),
                    thread: $('getplayerstatus ms thread').text(),
                });
            });
        });
    }
    async view(thread) {
        return new Promise((resolve, reject) => {
            const viewer = net.connect(thread.port, thread.addr);
            viewer.on('connect', () => {
                viewer.setEncoding('utf-8');
                viewer.write('<thread thread="' + thread.thread + '" res_from="0" version="20061206" />\0');
                resolve(viewer);
            });
        });
    }
}