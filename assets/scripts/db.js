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
        return callback(null,JSON.parse(json.substr(0,json.length-1)+"]}"));
    });
    
    cursor.on('error',function(err){
        return callback(err);
    });
};

var getAllUsers = function getAllUsers(callback){                       // Objecto que representa a função 
                                                                        // getAllUsers para que possa ser
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
    
    var cursor = UserList.find({}).cursor();
    
    json = "{ \"users\": [";
    
    cursor.on('data', function(user){
        json+= "{ \"id\": \""+user._id+"\","+
                "\"username\": \""+user.username+"\","+
                "\"password\": \""+user.password+"\","+
                "\"email\": \""+user.email+"\","+
                "\"firstName\": \""+user.firstName+"\","+
                "\"lastName\": \""+user.lastName+"\","+
                "\"picurl\": \""+user.picurl+"\","+
                "\"admin\": \""+user.admin+"\"},";
    });

    cursor.on('close',function(){
        return callback(null,JSON.parse(json.substr(0,json.length-1)+"]}"));
    });
    
    cursor.on('error',function(err){
        return callback(err);
    });
};


var addGame = function addGame(game){
    Futebol.findOne({"nome":game.nome},function(err,gm){
        if(gm){
            console.log('Game already exists!');
            return;
        }
        
        var ngame = new Futebol();
        
        ngame.equipaCasa = game.equipaCasa;
        ngame.equipaFora = game.equipaFora;
        ngame.nome = game.nome;
        ngame.golosCasa = game.golosCasa;
        ngame.golosFora = game.golosFora;
        ngame.data = game.data;
        
        return ngame.save(function(err,newgame){
           if(err){
               console.log('Error creating game '+newgame.id);
               return err;
           }
           
           console.log('Game '+newgame.id+' created!');
        });
    });
}

var findGame = function findGame(game,callback){
    return Futebol.findOne({"nome":nome},function(err,oldgame){
       if(err){
           console.log('Error: '+err);
           return callback(err);
       }else if(!user){
           return callback('Game not found!');
       }
        
        return callback(null,oldgame);
    });
};

var updateGame = function updateGame(gameid,upgame){
    return Futebol.findById(gameid, function(err, game){
        if(!game)                                                       //
            console.log('Error: Game not found!');                      //
        else if(err){
            console.log('Error: '+err);
            return err;
        }
        
        if(upgame.equipaCasa)
            game.equipaCasa=upgame.equipaCasa;
        
        if(upgame.equipaFora)
            game.equipaFora=upgame.equipaFora;
        
        if(upgame.nome)
            game.nome=upgame.nome;
        
        if(upgame.golosCasa)
            game.golosCasa=upgame.golosCasa;
        
        if(upgame.golosFora)
            game.golosFora=upgame.golosFora;
        
        if(upgame.data)
            game.data=upgame.data;
        
        return game.save(function(err) {
            if(!err)
                console.log('Game: '+game.nome+' was updated!');
            else
                return console.log('Error: '+err);
        });
    });
};


var deleteGame = function deleteGame(gameid){
    return Futebol.findById(gameid, function(err, game){
        if(!game)                                                           //
            return console.log('Error: Game not found!');                   //
        
        return game.remove(function(err,gm){
            if(!err)
                console.log('Game: '+ gm.nome +' - '+gm.id+' was deleted!');
            else
                return console.log('Error: '+err);
        });
    });
};


var addUser = function addUser(profile){
    UserList.findOne({"username":profile.username},function(err,user){
        if(user){
            console.log('User already exists!');
            return err;
        }
        
        var usr = new UserList();
        
        usr.username = profile.username;
        usr.password = usr.generateHash(profile.password);
        usr.email = profile.email;
        usr.firstName = profile.firstName;
        usr.lastName = profile.lastName;
        usr.picurl = profile.picurl;
        usr.admin = profile.admin;

        
        return usr.save(function(err,newusr){
           if(err){
               console.log('Error creating user '+newusr.id);
               return err;
           }
           
           console.log('User '+newusr.id+' created!');
        });
    });
}

var findUser = function findUser(username,callback){
    return UserList.findOne({"username":username},function(err,user){
       if(err){
           console.log('Error: '+err);
           return callback(err);
       }else if(!user){
           return callback('User not found!');
       }
        
        return callback(null,user);
    });
};

var updateUser = function updateUser(userid,profile){
    return UserList.findById(userid, function(err, user){
        if(!user)                                                       //
            console.log('Error: User not found!');                      //
        else if(err){
            console.log('Error: '+err);
            return err;
        }
        
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
                console.log('Username: '+user.username+' was updated!');
            else
                return console.log('Error: '+err);
        });
    });
};


var deleteUser = function deleteUser(userid){
    return UserList.findById(userid, function(err, user){
        if(!user)                                                           //
            return console.log('Error: User not found!');                   //
        
        return user.remove(function(err,usr){
            if(!err)
                console.log('Username: '+ usr.username +' - '+usr.id+' was deleted!');
            else
                return console.log('Error: '+err);
        });
    });
};

        
module.exports = {                                                      // Ao exportar os objectos estamos a
                                                                        // permitir que estes sejam usados 
                                                                        // dentro de outros ficheiros usando
                                                                        // require('./db');
                                                                        
  'Futebol': Futebol,                                                   // Exporta o objecto Futebol.
  'UserList':UserList,                                                  // Exporta o objecto UserList.
  'dbObj':dbObj,                                                        // Exporta o objecto dbObj que 
                                                                        // representa a ligação ao mongodb.
                                                                        
  'getAllGames': getAllGames,                                           // Exporta a função getAllGames
  'getAllUsers': getAllUsers,                                           // Exporta a função getAllUserss
  'findGame'   : findGame,                                              // Exporta a função findGame
  'addGame'    : addGame,                                               // Exporta a função addGame
  'updateGame' : updateGame,                                            // Exporta a função updateGame
  'deleteGame' : deleteGame,                                            // Exporta a função deleteGame
  'findUser'   : findUser,                                              // Exporta a função findUser
  'addUser'    : addUser,                                               // Exporta a função addUser
  'updateUser' : updateUser,                                            // Exporta a função updateUser
  'deleteUser' : deleteUser                                             // Exporta a função deleteUser
};