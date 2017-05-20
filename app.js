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

//mongoose.connect('mongodb://uhasoshxfidsfm3:VWT69vaueZBwHL7sO0jZ@brynr3osgrcc1g5-mongodb.services.clever-cloud.com:27017/brynr3osgrcc1g5');
mongoose.connect('mongodb://Goldenheaven:sdistribuidos@ds062919.mlab.com:62919/futebol');

var db = mongoose.connection;
var Schema = mongoose.Schema;

var ResultadoSchema = new Schema({
    myid: Number,
    nome: String,
    equipaCasa: String,
    golosCasa: Number,
    golosFora: Number,
    equipaFora: String
});



var UsersSchema = new Schema({
    myid: Number,
    username: String,
    pwd: String
});


var Futebol = mongoose.model('futebols', ResultadoSchema,'futebols' );
var UserList = mongoose.model('users',UsersSchema,'users');

app.set('trust proxy','0.0.0.0');


// Definir a route principal
app.get('/', function(req, res) {    
    db.on('error', console.error.bind(console, 'connection error:'));
    
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write(header);
    
    res.write(getMenu);

    var getJogos = require('./scripts/htmlContent.js').getMainPageContent(res,Futebol);
});

// Definir a route principal
app.get('/login', function(req, res) {    
    db.on('error', console.error.bind(console, 'connection error:'));
    
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write(header);
    
    res.render('./logintest.js');
    //res.write(getLoginPageContent);
    //res.end(endPage);
});

// Definir a route principal
app.get('/user', function(req, res) {    
    db.on('error', console.error.bind(console, 'connection error:'));
    
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write(header);
    
    var id = req.query.id;
    var getSignedMenu;
    
    if(id!=null){
        var uCursor = UserList.find({myid:id}).exec(function(err, data) {
            if (err) return done(err);
            
            if(data.length==0) {
                res.status(500).send('<h1>Invalid user data!</h1>');
                return;
            };
            
            data.forEach(function (user){
                getSignedMenu = require('./scripts/login.js').getSignedMenu(user);
                res.write(getSignedMenu);
                res.write(getLoginPageContent);
                res.end(endPage);
            });
        });
    }else{
        getSignedMenu = require('./scripts/login.js').getSignedMenu(null);
        res.write(getSignedMenu);
        res.write(getLoginPageContent);
        res.end(endPage);
    }
});

app.listen(port,'0.0.0.0');