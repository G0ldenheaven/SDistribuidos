const config    = require('./assets/scripts/config');                       // Ficheiro onde guardamos 
                                                                            // informações que são bastante
                                                                            // reutilizaveis.
                                                                            
const db        = require('./assets/scripts/db');                           // Ficheiro onde guardamos tudo 
                                                                            // que tem a ver com a base de 
                                                                            // dados mongodb.
                                                                            
const app       = require('./assets/scripts/expressDados').app;             // Objecto app que contem as 
                                                                            // funçoes do express ja config.
                                                                            
const passport  = require('./assets/scripts/expressDados').passport;        // middleware de autenticaçao para
                                                                            // o node ja configurado.
                                                                            
function isLoggedIn(req, res, next) {                                       // Função que permite garantir que 
                                                                            // o utilizador esta autenticado.

    if (req.isAuthenticated())                                              // Se estiver autenticado corre a
        return next();                                                      // proxima função

    res.redirect('/');                                                      // Senao redireciona para a pagina
}                                                                           // principal

                                                                            // Define a route principal, ou
                                                                            // seja, a pagina que ira ser 
                                                                            // mostrada ao utilizador ao 
app.get('/', function(req, res) {                                           // entrar no url
    db.getAllGames(function(err,jogos){
        if(err){
            res.status(500).send('Error: '+err);
        }else{
            res.render('index',{jogos:jogos,user:req.user,viewer:req.user});
        }
    });
});


app.get('/login', function(req,res){
    res.render('login');
});


app.get('/signup',function(req,res){                                            //
    res.render('signup');                                                       //
}); 


app.get('/profile/:user',isLoggedIn, function(req, res) {                       //
    db.findUser(req.params.user,function(err,user){
        if(err && req.user.admin){
            res.status(500).send('Error: '+err+' </br> Click <a href="javascript:history.back();">Here</a> to go back!');
        }else if(err!="User not found!" && err){
            res.status(500).send('Oops page not found! </br> Click <a href="javascript:history.back();">Here</a> to go back!');
        }else{
            if(req.user.admin)
                res.render('profile',{user:user,viewer:req.user});                              //
            else if(!req.user.admin && req.user.username===req.params.user)
                res.render('profile',{user:req.user,viewer:req.user});
            else
                res.redirect('/profile/'+req.user.username);
        }
    });
});                                                                             //

app.get('/profileRedir',isLoggedIn, function(req, res) {                        // 
    if(req.user.admin)
        res.redirect('/backoffice');                                            //
    else
        res.redirect('/profile/'+req.user.username);                            //
});                                                                             //


app.get('/backoffice',isLoggedIn, function(req, res) {                          //
    res.render('backoffice',{user:req.user});                                   //
});                                                                             //


app.get('/logout', function(req, res) {                                         //
    req.logout();                                                               //
    res.redirect('/');                                                          //
});     


app.get('/users',isLoggedIn, function(req, res) {                               //
    db.getAllUsers(function(err,users){
        if(err){
            res.status(500).send('Error: '+err+' </br> Click <a href="javascript:history.back();">Here</a> to go back!');
        }else{
            res.render('users',{users:users,user:req.user,viewer:req.user});
        }
    });
});


app.get('/users/add',isLoggedIn, function(req, res) {                               //
    res.render('usersadd',{user:req.user,viewer:req.user});
});


app.get('/games',isLoggedIn, function(req, res) {                           //
    db.getAllGames(function(err,jogos){
        if(err){
            res.status(500).send('Error: '+err+' </br> Click <a href="javascript:history.back();">Here</a> to go back!');
        }else{
            res.render('games',{jogos:jogos,user:req.user,viewer:req.user});
        }
    });
});


app.get('/games/add',isLoggedIn, function(req, res) {                               //
    res.render('gamesadd',{user:req.user,viewer:req.user});
});


app.post('/login',                                                          //
    passport.authenticate('local-login',{
        successRedirect: '/profileRedir',
        failureRedirect: '/login'                                           //
}));                                                                        //


app.post('/signup',                                                         //
    passport.authenticate('local-signup',{                                  //
        successRedirect: '/profileRedir',                                   //
        failureRedirect: '/login'                                           //
}));   


app.post('/users/adduser',isLoggedIn,function(req,res){
    var profile = {};
    profile.username = req.body.username;
    profile.password = req.body.password;
    profile.email = req.body.email;
    profile.firstName = req.body.firstName;
    profile.lastName = req.body.lastName;
    profile.picurl = req.body.picurl;
    profile.admin = req.body.admin;
    db.addUser(profile);
    res.redirect('/users');
});


app.post('/games/addgame',isLoggedIn,function(req,res){
    var game = {};
    game.equipaCasa = req.body.equipaCasa;
    game.equipaFora = req.body.equipaFora;
    game.nome = req.body.njogo;
    game.golosCasa = req.body.gcasa;
    game.golosFora = req.body.gfora;
    game.data = '';
    db.addGame(game);
    res.redirect('/games');
});

app.put('/profile/:id',isLoggedIn, function(req, res) {                     // Pagina de perfil do user actual

    var profile = req.body.profile;                                         // Perfil do utilizador que e
                                                                            // recebido no body e enviado pelo
                                                                            // formulario na pagina profile

    var userid = req.params.id;
    
    db.updateUser(userid,profile);
});    


app.put('/users/:id',isLoggedIn, function(req, res) {                       //
    var profile = req.body.profile;                                         // Perfil do utilizador que e
                                                                            // recebido no body e enviado pelo
                                                                            // formulario na pagina users
    var id = req.params.id;
    db.updateUser(id,profile);
});

app.put('/games/:id',isLoggedIn, function(req, res) {                       //
    var game = req.body.game;                                               // Perfil do utilizador que e
                                                                            // recebido no body e enviado pelo
                                                                            // formulario na pagina games
    var id = req.params.id;
    db.updateGame(id,game);
});


app.delete('/users/:id',isLoggedIn, function(req, res) {                        //
    var id = req.params.id;
    db.deleteUser(id);
});                                                                         //


app.delete('/profile/:id',isLoggedIn, function(req, res) {                        //
    var id = req.params.id;
    db.deleteUser(id);
});                                                                         //


app.delete('/games/:id',isLoggedIn, function(req, res) {                        //
    var id = req.params.id;
    db.deleteGame(id);
});                                                                         //
