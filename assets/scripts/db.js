const mongoose  = require('mongoose');                                  // O modulo mongoose permite aceder a 
                                                                        // base de dados mongodb facilmente.
                                                                        
const config    = require('./config');                                  // Ficheiro onde guardamos informações 
                                                                        // que são bastante reutilizaveis.
                                                                        
const bcrypt    = require('bcrypt-nodejs');                             // Modulo que contem funçoes para 
                                                                        // gerar uma hash da password e 
                                                                        // verificar se hash e password são 
                                                                        // iguais.

mongoose.connect(config.url);                                           // Liga-se a bd mongodb no url 
                                                                        // especificado no ficheiro config.js.

var dbObj  = mongoose.connection;                                       // Objecto que representa a ligação 
                                                                        // ao mongodb.

var Schema = mongoose.Schema;                                           // Representa um Schema que é um mapa
                                                                        // (ligação) para uma colecção do
                                                                        // mongodb e define a estrutura dos
                                                                        // documentos da colecção.

var ResultadoSchema = new Schema({                                      // Schema para representar os dados 
                                                                        // dos jogos que estão guardados 
                                                                        // no mongodb
    
    nome        : String,                                               // Nome do Jogo que tem o formato: 
                                                                        // Nome da equipaCasa vs Nome da 
                                                                        // equipaFora.
    
    equipaCasa  : String,                                               // String com os links da imagem 
                                                                        // guardados na bdados da equipaCasa.
    
    golosCasa   : Number,                                               // Numero de golos que a equipaCasa 
                                                                        // marcou.
    
    golosFora   : Number,                                               // Numero de golos que a equipaFora 
                                                                        // marcou.
    
    equipaFora  : String,                                               // String com os links da imagem
                                                                        // guardados na bd da equipaFora.
                                                                        
    data        : Date                                                  // Data em que o jogo foi realizado.
});

var UsersSchema = new Schema({                                          // Schema para representar os dados 
                                                                        // dos utilizadores que estão 
                                                                        // guardados no mongodb.
                                                                        
    username  : String,                                                 // Username dos utilizadores.
    password  : String,                                                 // Password dos utilizadores.
    email     : String,                                                 // Email dos utilizadores.
    firstName : String,                                                 // Primeiro nome dos utilizadores.
    lastName  : String,                                                 // Ultimo nome dos utilizadores.
    picurl    : String,                                                 // Imagem de prefil
    admin     : Boolean                                                 // Administrador
});

UsersSchema.methods.generateHash  = function(password) {                // Adiciona ao objecto UserSchema a 
                                                                        // função que gera hashes.
                                                                        
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);      // Devolve uma string com a hash da 
                                                                        // password do utilizador que ira ser 
                                                                        // guardada na bd quando se fizer o 
};                                                                      // registo.

UsersSchema.methods.validPassword = function(password) {                // Adiciona ao objecto UserSchema a
                                                                        // função que verifica se password e 
                                                                        // hash sao iguais.
                                                                        
    return bcrypt.compareSync(password, this.password);                 // Devolve o resultado da comparação
                                                                        // entre hash e password 
};                                                                      // (provavelmente true/false).

var Futebol  = mongoose.model('futebols', ResultadoSchema,'futebols' ); // Inicializa a variavel Futebol
                                                                        // com o construtor model, representam
                                                                        // os documentos da colecção futebols
                                                                        // guardados no mongodb.
                                                                                    
var UserList = mongoose.model('users',UsersSchema,'users');             // Inicializa a variavel UserList com
                                                                        // o model que representa os 
                                                                        // documentos da colecção users
                                                                        // guardados no mongodb.

var getAllGames = function getAllGames(callback){                       // Objecto que representa a função 
                                                                        // getAllGames para que possa ser
                                                                        // usada noutro ficheiro.
                                                                        
    // Muito importante: Um callback é uma função que será chamada mais tarde, para tal a função e passada
    // como parametro. O objectivo do callback é obter um resultado que não conseguimos normalmente aceder
    // devido ao resultado com queremos a trabalhar estar dentro de uma função assincrona, então usamos o
    // resultado como parametro da função callback que é chamada na zona onde queremos trabalhar e ai acedemos
    // aos dados. Apesar de parecer complicado e bastante facil de perceber assim que se observe um exemplo do
    // genero:
    // function queroTrabalharAqui(){
    //      func(function(resultado){    <- Estamos a chamar a função func que tem como parametro a função de 
    //                                      callback e o callback tem um parametro que serão os resultados
    //                                      que queremos que sejam obtidos e trabalhados.
    //
    //          console.log(resultado);  <- Mostra os valores pesquisados na base de dados dentro do find da
    //                                      função func.
    //      });
    //  }
    //
    // function func(callback){
    //      Model.find({'username':'alguem'}).cursor().on('data',function(alguem){
    //          callback(alguem); <- Como acima dissemos que function era a nossa função callback e resultado
    //                               sera o parametro dessa função, aqui indicamos que resultado = alguem e
    //                               vamos chamar a função callback.
    //      });
    // }
    //
    // Resumindo: queroTrabalharAqui chama func que chama uma função definida quando chamamos func que será o
    // nosso callback.
    
    var cursor = Futebol.find({}).cursor();
    
    json = "{ \"jogos\": [";
    
    cursor.on('data', function(jogo){
        json+= "{ \"id\": \""+jogo._id+"\","+
                "\"equipaCasa\": \""+jogo.equipaCasa+"\","+
                "\"nome\": \""+jogo.nome+"\","+
                "\"equipaFora\": \""+jogo.equipaFora+"\","+
                "\"golosCasa\": \""+jogo.golosCasa+"\","+
                "\"golosFora\": \""+jogo.golosFora+"\"},";
    });

    cursor.on('close',function(){
        callback(JSON.parse(json.substr(0,json.length-1)+"]}"));
    });
};

var updateUser = function updateUser(userid,profile){
    return UserList.findById(userid, function(err, user){
        if(!user)                                                           //
            return console.log('Error: User not found!');                   //
        
        if(profile.username)
            user.username=profile.username;
        
        if(profile.password)
            user.password=user.generateHash(profile.password);
        
        if(profile.firstName)
            user.firstName=profile.firstName;
        
        if(profile.lastName)
            user.lastName=profile.lastName;
        
        if(profile.email)
            user.email=profile.email;
        
        if(profile.picurl)
            user.picurl=profile.picurl;
                                                                //
        
        return user.save(function(err) {
            if(!err)
                console.log('Username: '+user.username+' was updated');
            else
                console.log('Error: '+err);
        });
    });
}
                                                                        
module.exports = {                                                      // Ao exportar os objectos estamos a
                                                                        // permitir que estes sejam usados 
                                                                        // dentro de outros ficheiros usando
                                                                        // require('./db');
                                                                        
  'Futebol': Futebol,                                                   // Exporta o objecto Futebol.
  'UserList':UserList,                                                  // Exporta o objecto UserList.
  'dbObj':dbObj,                                                        // Exporta o objecto dbObj que 
                                                                        // representa a ligação ao mongodb.
                                                                        
  'getAllGames': getAllGames,                                           // Exporta a função getAllGames
  'updateUser': updateUser                                              // Exporta a função updateUser
};