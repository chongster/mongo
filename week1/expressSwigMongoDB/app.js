var express = require('express'),
	app = express(),
	cons = require('consolidate'),
	MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server;
	
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + "/views");

var mongoclient = new MongoClient(new Server('localhost', 27017,{
	'native_parser': true}));

var db = mongoclient.db('test');

//setting express routes
app.get('/', function (req, res) {
	db.collection('names').findOne( {}, function(err, doc) {
		res.render('hello', doc);
	});
});

//404 route
app.get('*', function (req, res) {
	res.send("Page Not Found", 404);
});

mongoclient.open(function (err, mongoclient) {
	if (err) throw err;
	app.listen(8080);
	console.log("express server started on port 8080");
});