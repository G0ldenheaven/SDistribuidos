var express = require('express');
var app = express();
var mongoose = require('mongoose');
var utils = require('util');
var promise = require('promises');
var header = require('./scripts/htmlContent.js').header();
var getMenu = require('./scripts/htmlContent.js').getMenu();
var endPage = require('./scripts/htmlContent.js').endPage();
var getLoginPageContent = require('./scripts/login.js').getLoginPageContent();
var port = process.env.port || 443;

mongoose.connect('mongodb://uhasoshxfidsfm3:VWT69vaueZBwHL7sO0jZ@brynr3osgrcc1g5-mongodb.services.clever-cloud.com:27017/brynr3osgrcc1g5');

var db = mongoose.connection;
var Schema = mongoose.Schema;

var Resultado = new Schema({
    id: Number,
    nome: String,
    equipaCasa: Buffer,
    golosCasa: Number,
    golosFora: Number,
    equipaFora: Buffer
});


var Users = new Schema({
    id: Number,
    username: String,
    pwd: String
});


var Futebol = mongoose.model('futebols', Resultado,'futebols');
var UserList = mongoose.model('users', Users,'users');

app.set('trust proxy','0.0.0.0');


// Definir a route principal
app.get('/', function(req, res) {    
    db.on('error', console.error.bind(console, 'connection error:'));
    
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(header);
    
    res.write(getMenu);

    var getJogos = require('./scripts/htmlContent.js').getMainPageContent(res,Futebol);
});

// Definir a route principal
app.get('/login', function(req, res) {    
    db.on('error', console.error.bind(console, 'connection error:'));
    
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(header);
    
    var id = req.query.id;
    
    var getSignedMenu = require('./scripts/login.js').getSignedMenu(req);
    res.write(getSignedMenu);
    
    var cursor = UserList.find({}).cursor();
 
    cursor.on('data', function(usr){
        if(usr.id==id){
            res.write(usr.username);
        }
    });
    
    cursor.on('close', function(usr){
        if(usr.id==id){
            res.write(usr.username);
        }
    });
    
    res.write(" "+id);

    res.write(getLoginPageContent);
    res.end(endPage);
});

// Definir a route principal
app.get('/user', function(req, res) {    
    db.on('error', console.error.bind(console, 'connection error:'));
    
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(header);
    
    var username = req.query.username;
    
    var getSignedMenu = require('./scripts/login.js').getSignedMenu(username);
    res.write(getSignedMenu);

    res.write(username);

    res.write(getLoginPageContent);
    res.end(endPage);
});

app.listen(port,'0.0.0.0');