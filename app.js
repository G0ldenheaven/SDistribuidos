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
    db.getAllGames(function(jogos){
        res.render('index.pug',{jogos:jogos,user:req.user});
    });
});

app.get('/login', function(req,res){
    res.render('login');
});

app.post('/login',                                                          //
    passport.authenticate('local-login',{
        successRedirect: '/profileRedir',
        failureRedirect: '/login'                                           //
}));                                                                        //


app.get('/signup',function(req,res){                                        //
    res.render('signup');                                                   //
});                                                                         //


app.post('/signup',                                                         //
    passport.authenticate('local-signup',{                                  //
        successRedirect: '/profile',                                        //
        failureRedirect: '/login'                                           //
}));                                                                        //


app.get('/profile',isLoggedIn, function(req, res) {                         // 
        res.render('profile',{user:req.user});                              //
});                                                                         //

app.get('/profileRedir',isLoggedIn, function(req, res) {                    // 
    if(req.user.admin==true)
        res.redirect('/backoffice');                                        //
    else
        res.redirect('/profile');                                           //
});                                                                         //


app.get('/backoffice',isLoggedIn, function(req, res) {                      //
    res.render('backoffice',{user:req.user});                               //
});                                                                         //


app.get('/logout', function(req, res) {                                     //
    req.logout();                                                           //
    res.redirect('/');                                                      //
});                                                                         //


app.put('/profile',isLoggedIn, function(req, res) {                         // Pagina de perfil do user actual

    var profile = req.body.profile;                                         // Perfil do utilizador que e
                                                                            // recebido no body e enviado pelo
                                                                            // formulario na pagina profile

    var userid = req.user._id;
    
    db.updateUser(userid,profile);
});                                                                         //


app.delete('/users',isLoggedIn, function(req, res) {                        //
    console.log(req.body.picurl);
    res.end();
    //res.render('users',{user:req.user});                                  //
});                                                                         //
