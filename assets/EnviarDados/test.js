var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// img path
var imgPath = 'C:\\Users\\Goldenheaven\\Desktop\\trab\\benfica.png';

// connect to mongo
mongoose.connect('mongodb://Goldenheaven:sdistribuidos@ds062919.mlab.com:62919/futebol');
//mongoose.connect('mongodb://uhasoshxfidsfm3:VWT69vaueZBwHL7sO0jZ@brynr3osgrcc1g5-mongodb.services.clever-cloud.com:27017/brynr3osgrcc1g5');

// example schema

var schema = new Schema({
    myid: Number,
	nome: String,
	equipaCasa: Buffer,
	golosCasa: Number,
	golosFora: Number,
	equipaFora: Buffer
})

// our model
var A = mongoose.model('Futebol', schema);

mongoose.connection.on('open', function () {
  console.error('mongo is open');

  // empty the collection
  A.remove(function (err) {
    if (err) throw err;

    console.error('removed old docs');

    // store an img in binary in mongo
    var a = new A;
    a.myid=1;
	a.nome = "Benfica vs Porto";
    a.equipaCasa = fs.readFileSync(imgPath);
	a.golosCasa = 7;
	a.golosFora = 0;
    a.equipaFora = fs.readFileSync(imgPath);
    a.save(function (err, a) {
      if (err) throw err;

      console.error('saved img to mongo');

      // start a demo server
      var server = express();
      server.get('/', function (req, res, next) {
        A.findById(a, function (err, doc) {
          if (err) return next(err);
          res.contentType("image/png");
          res.send(doc.equipaCasa);
        });
      });

      server.on('close', function () {
        console.error('dropping db');
        mongoose.connection.db.dropDatabase(function () {
          console.error('closing db connection');
          mongoose.connection.close();
        });
      });

      server.listen(3333, function (err) {
        console.error('server listening on http://127.0.0.1:3333');
        console.error('press CTRL+C to exit');
      });

      process.on('SIGINT', function () {
        server.close();
      });
    });
  });

});