var http = require('http');
var express = require('express');

var app = express();

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/css', express.static(__dirname + '/css'));

app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
	res.render('home', {
		title: 'Welcome'
	});
});

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Listening at http://%s:%s', host, port);
});
