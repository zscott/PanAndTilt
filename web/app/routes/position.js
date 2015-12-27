var express = require('express');
var router = express.Router();

var net = require('net');
var HOST = '0.0.0.0';
var PORT = 5000;
var socket;

var server;
var serverSocketCreateInterval;

var createServer = function() {
    if (server) return;

    server = net.createServer(function(sock) {
        console.log('CONNECTED: ' + sock.remoteAddress + ":" + sock.remotePort);
        socket = sock;

        sock.on('data', function(data) {
            console.log('DATA ' + sock.remoteAddress + ': ' + data);
        });

        sock.on('close', function(data) {
            console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
            createServer();
        });

    });

    server.listen(PORT, HOST, function() {
        console.log('Bot server listening on ' + HOST + ':' + PORT);
    });
};

createServer();

/* POST new position */
router.post('/', function(req, res, next) {
    var pan = req.body.pan;
    var tilt = req.body.tilt;
    var encoded = String.fromCharCode(parseInt(pan)) + String.fromCharCode(parseInt(tilt));
    //console.log("sending command pan=" + pan + " tilt=" + tilt);
    if (socket) {
        socket.write(encoded);
    }
    res.sendStatus(200);
});

module.exports = router;
