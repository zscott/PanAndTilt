var express = require('express');
var router = express.Router();

var net = require('net');
var HOST = '0.0.0.0';
var PORT = 5000;
var socket;

var sendRandomPanTiltCommand = function(sock) {
    var pan = String.fromCharCode((Math.random() * 100));
    var tilt = String.fromCharCode((Math.random() * 100));
    sock.write(pan + tilt)
};

var server;
var serverSocketCreateInterval;

var createServer = function() {
    if (server) return;

    server = net.createServer(function(sock) {
        console.log('CONNECTED: ' + sock.remoteAddress + ":" + sock.remotePort);
        socket = sock;
        //interval = setInterval(sendRandomPanTiltCommand, 5000, sock)

        sock.on('error', function() {
            console.log('error');
            //socket.destroy();
            //socket = null;
        });

        sock.on('data', function(data) {
            console.log('DATA ' + sock.remoteAddress + ': ' + data);
        });

        sock.on('close', function(data) {
            console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        });

    });

    server.listen(PORT, HOST, function() {
        console.log('Server listening for connection from PI on ' + HOST + ':' + PORT);
    });

    //serverSocketCreateInterval = setInterval(createServer, 10000);
};

createServer();

/* POST new position */
router.post('/', function(req, res, next) {
    var pan = req.body.pan;
    var tilt = req.body.tilt;
    var encoded = String.fromCharCode(parseInt(pan)) + String.fromCharCode(parseInt(tilt));
    console.log("sending command pan=" + pan + " tilt=" + tilt);
    if (socket) {
        socket.write(encoded);
    }
    res.sendStatus(200);
});

module.exports = router;
