var express = require('express');
var app = express();
var mongoose = require('mongoose');
var utils = require('util');
var promise = require('promises');
var header = require('./scripts/htmlContent.js').header();
var getMenu = require('./scripts/htmlContent.js').getMenu();
var endPage = require('./scripts/htmlContent.js').endPage();
var port = process.env.port || 443;

mongoose.connect('mongodb://uhasoshxfidsfm3:VWT69vaueZBwHL7sO0jZ@brynr3osgrcc1g5-mongodb.services.clever-cloud.com:27017/brynr3osgrcc1g5');

var db = mongoose.connection;
var Schema = mongoose.Schema;

var Resultado = new Schema({
    nome: String,
    equipaCasa: Buffer,
    golosCasa: Number,
    golosFora: Number,
    equipaFora: Buffer
});


var Futebol = mongoose.model('futebols', Resultado,'futebols');

app.set('trust proxy','0.0.0.0');


// Definir a route principal
app.get('/', function(req, res) {    
    db.on('error', console.error.bind(console, 'connection error:'));
    
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(header);
    
    var getMenuLinks = require('./scripts/htmlContent.js').getMenu(req);
    res.write(getMenuLinks);

    var getJogos = require('./scripts/htmlContent.js').getMainPageContent(res,Futebol);
});

app.listen(port,'0.0.0.0');