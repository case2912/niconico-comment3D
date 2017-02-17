import Nicolive from './nicolive';
import fs from 'fs';
import http from 'http';
import IO from 'socket.io'
const server = http.createServer();
const io = IO(server);
let socket = null;
io.on('connection', function(_socket) {
    socket = _socket;
});
server.listen(3000);


var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const init = async() => {
    setInterval(function() {
        if (socket !== null) {
            socket.emit('text', Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8));
        }
    }, 1000);
    // const nicolive = new Nicolive();
    // const session = await nicolive.login(config.mail, config.pass);
    // const thread = await nicolive.feachThread(config.liveID, session);
    // const view = await nicolive.view(thread);
    // view.on('data', (data) => {
    //     const text = data.match(/<chat.*?>(.*?)<\/chat>/);
    //     if (text !== null && text[1].charAt(0) !== "/") {
    //         if (socket !== null) {
    //             socket.emit('text', text[1]);
    //         }
    //         console.log(text[1]);
    //     }
    // });
}
init();