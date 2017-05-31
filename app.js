const pug = require('pug');
const config = require('./scripts/config.js');
const db = require('./scripts/db.js');
const app = require('./scripts/expressDados').app;
const passport = require('./scripts/expressDados').passport;
const ensureLoggedIn = require('./scripts/expressDados').ensureLoggedIn;
const localStorage = require('./scripts/expressDados').LocalStorage;

// Definir a route principal
app.get('/', function(req, res) {    
    db.dbObj.on('error', console.error.bind(console, 'connection error:'));
    
    var getJogos = require('./scripts/htmlContent.js').getMainPageContent(req,res,pug,db.Futebol);
});

// Definir a route principal
app.get('/login', function(req, res) {    
    db.dbObj.on('error', console.error.bind(console, 'connection error:'));
    
    var user = req.session.user;
    
    
    if(user && user.length>0){    
        res.end(pug.renderFile('scripts/index.pug',{data:req.session}));
    }else{
        //res.redirect('/callback');
        res.end(pug.renderFile('scripts/login.pug',{data:req.session}));
    }
    
});

app.post('/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    var user = req.session.user;

    if(!user || user.length==0){
    
        var uCursor = db.UserList.findOne({username:username,password:password}).exec(function(err, data) {
            if (err) return done(err);
            
            if(data==null) {
                res.status(500).send('Dados Invalidos. Se não possui uma conta <a href="/signup">clique aqui</a>  para criar uma!'+
                '<br/><a href="#" onclick="javascript:history.back();">Clique aqui</a> para voltar a pagina principal!');
            }else{
                req.session.user=data;
                res.redirect('/users');
            }
        });
    }else{
        res.end(pug.renderFile('scripts/index.pug',{data:req.session}));
    }
});


app.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/', redirect:true,
        redirectUrl: 'https://goldenheaven.azurewebsites.net/',
        responseType: 'token'}),
  function(req, res) {
    res.send(req.user);
});

// Definir a route principal
app.get('/users', function(req, res) {    
    db.dbObj.on('error', console.error.bind(console, 'connection error:'));
    
    
    res.send(req);
    
    //res.redirect('/');
});
