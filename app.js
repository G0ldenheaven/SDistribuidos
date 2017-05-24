const express = require('express');
const session = require('express-session');
const app = express();
const pug = require('pug');
const mongoose = require('mongoose');
const utils = require('util');
const cookieParser = require('cookie-parser');const bodyParser = require('body-parser');
const header = require('./scripts/htmlContent.js').header();
const getMenu = require('./scripts/htmlContent.js').getMenu();
const endPage = require('./scripts/htmlContent.js').endPage();
const getLoginPageContent = require('./scripts/login.js').getLoginPageContent();
const port = process.env.port || 443;

//mongoose.connect('mongodb://uhasoshxfidsfm3:VWT69vaueZBwHL7sO0jZ@brynr3osgrcc1g5-mongodb.services.clever-cloud.com:27017/brynr3osgrcc1g5');
mongoose.connect('mongodb://Goldenheaven:sdistribuidos@ds062919.mlab.com:62919/futebol');

var db = mongoose.connection;
var Schema = mongoose.Schema;

var ResultadoSchema = new Schema({
    myid: Number,
    nome: String,
    equipaCasa: Buffer,
    golosCasa: Number,
    golosFora: Number,
    equipaFora: Buffer
});

var UsersSchema = new Schema({
    myid: Number,
    username: String,
    pwd: String
});


var Futebol = mongoose.model('futebols', ResultadoSchema,'futebols' );
var UserList = mongoose.model('users',UsersSchema,'users');

app.set('trust proxy','0.0.0.0');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    user: [],
    secret:"sdistribuidos",
    saveUninitialized:true,
    resave:true,
    cookie:{
        path:"/",
        maxAge: 30000
    }
}));
app.use(cookieParser());

function VerificarAutenticacao(req,res,next){
    console.log(req.session.user.username);
    if(req.session && req.session.user.username.length>0){
        next();
    }else{
        res.send('Não tem permissões para ver esta pagina!</br><a href="/login">Clique aqui para fazer login!</a>');
    }
}

// Definir a route principal
app.get('/', function(req, res) {    
    db.on('error', console.error.bind(console, 'connection error:'));
    
    var getJogos = require('./scripts/htmlContent.js').getMainPageContent(req,res,pug,Futebol);
});

// Definir a route principal
app.get('/login', function(req, res) {    
    db.on('error', console.error.bind(console, 'connection error:'));
    
    var user = req.session.user;
    
    
    if(user && user.length>0){    
        res.end(pug.renderFile('scripts/index.pug',{data:req.session}));
    }else{
        res.end(pug.renderFile('scripts/login.pug'));
    }
    
});

app.get('/logver',VerificarAutenticacao,function(req,res){
   res.send('Esta logged!'); 
});

app.post('/login',function(req,res){
    var username = req.body.username;
    var pwd = req.body.password;

    var user = req.session.user;

    if(!user || user.length==0){
    
        var uCursor = UserList.findOne({username:username,pwd:pwd}).exec(function(err, data) {
            if (err) return done(err);
            
            if(data==null) {
                res.status(500).send('Conta invalida, <a href="/signup">clique aqui</a>  para criar uma conta!'+
                '<br/><a href="/">Clique aqui</a> para voltar a pagina principal!');
            }else{
                req.session.user=data;
                res.redirect('/users');
            }
        });
    }else{
        res.end(pug.renderFile('scripts/index.pug',{data:req.session}));
    }
});

// Definir a route principal
app.get('/users',VerificarAutenticacao, function(req, res) {    
    db.on('error', console.error.bind(console, 'connection error:'));
    
    var user = req.session.user;
    
    if(!user || user.length==0) {
        res.status(500).end('Invalid user data!');
    }
    
    res.redirect('/');
});

app.listen(port,'0.0.0.0');