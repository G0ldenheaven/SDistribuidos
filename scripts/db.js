const mongoose = require('mongoose');
const config = require('./config.js');

mongoose.connect(config.url);

var dbObj = mongoose.connection;
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

module.exports = {
  'Futebol': Futebol,
  'UserList':UserList,
  'dbObj':dbObj
};