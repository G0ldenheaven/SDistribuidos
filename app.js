var express = require('express');
var app = express();
var mongoose = require('mongoose');
var utils = require('util');
var promise = require('promises');

mongoose.connect('mongodb://uhasoshxfidsfm3:VWT69vaueZBwHL7sO0jZ@brynr3osgrcc1g5-mongodb.services.clever-cloud.com:27017/brynr3osgrcc1g5');

var db = mongoose.connection;
var Schema = mongoose.Schema;

var Resultado = new Schema({
    nome: String,
    equipaCasa: Buffer,
    golosCasa: Number,
    golosFora: Number,
    equipaFora: Buffer
})

var Futebol = mongoose.model('futebols', Resultado,'futebols');

// Definir a route principal
app.get('/', function(req, res) {
    db.on('error', console.error.bind(console, 'connection error:'));
    
    var cursor = Futebol.find({}).cursor();
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<!DOCTYPE html>");
    res.write('<html>');
    
        res.write('<head>');
            res.write('<meta charset="UTF-8">');
            res.write('<title>Futebol - Pplware</title>');
            res.write("<script type='text/javascript' src='scripts/jquery.min.js'></script>");
            res.write("<script type='text/javascript' src='scripts/bootstrap.min.js'></script>");
            res.write("<link rel='stylesheet' href='http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css'/>");
        res.write('</head>');
        
        res.write('<body style="width:100%">');
            res.write('<nav class="navbar navbar-inverse" role="navigation" style="padding-left:130px;">');
                res.write('<ul class="nav navbar-nav">');
                    res.write('<li class="active"><a href="/">Home<span class="sr-only">(current)</span></a></li>');
                    res.write('<li><a href="/about">About us</a></li>');
                    res.write('<li><a href="/contact">Contact us</a></li>');
                res.write('</ul>');
            res.write('</nav>');
            res.write('<center style="width:100%"');
                res.write('<div>');
                    res.write('<b style="font-size:30px">Resultados dos Jogos Disputados Hoje');
                        res.write('<br/>');
                        res.write('<br/>');
        
    cursor.on('data', function(jogo){
        
                        res.write('<div>');
                            res.write('<img style="height:100px" src="data:image/jpeg;base64,'+ jogo.equipaCasa.toString('base64') +'"/>');
                            res.write('<span>'+jogo.nome);
                            res.write('<img style="height:100px" src="data:image/jpeg;base64,'+ jogo.equipaCasa.toString('base64') +'"/>');
                            res.write('<br/>');
                            res.write(''+jogo.golosCasa.toString()+' : '+jogo.golosFora.toString());
                            res.write('</span>');
                        res.write('</div>');
    });
    
    cursor.on('close', function(){
                    res.write('</b>');
                res.write('</div>');
            res.write('</center');
        res.write('</body>');
            
    res.end('</html>');
    });
});

// Aplicação disponível em http://127.0.0.1:8888/
app.listen(8080);