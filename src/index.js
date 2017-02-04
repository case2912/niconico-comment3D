var nicolive = require('./nicolive');
var fs = require('fs');

var server = require('http').createServer();
var io = require('socket.io')(server);
var socket = null;
io.on('connection', function(_socket) {
    socket = _socket;
    _socket.on('event', function(data) {});
    _socket.on('disconnect', function() {});
});
server.listen(3000);
// setInterval(function() {
//     if (socket !== null) {
//         const date = new Date();
//         socket.emit('date', date.getMinutes() + ":" + date.getSeconds());
//         console.log(date.getMinutes() + ":" + date.getSeconds());
//     }
// }, 1000);


// Demonstration
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

process.nextTick(function() {
    // Environment
    var id = config.mail;
    var pw = config.pass;
    var live_id = config.liveID;

    // Boot
    nicolive.login(id, pw, function(error, session) {
        if (error != null) throw error;

        nicolive.fetchThread(live_id, session, function(error, thread) {
            if (error != null) throw error;

            nicolive.view(thread, function(error, viewer) {
                if (error != null) throw error;

                viewer.on('data', function(data) {
                    const text = data.match(/<chat.*?>(.*?)<\/chat>/);
                    if (text !== null && text[1].charAt(0) !== "/") {
                        if (socket !== null) {
                            socket.emit('date', text[1]);
                        }
                        console.log(text[1]);
                    }
                });
            });
        });
    });
});