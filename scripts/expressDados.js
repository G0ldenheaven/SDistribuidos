const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config.js');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const Auth0Strategy = require('passport-auth0');
const Auth0Lock = require('auth0-lock');
const localStorage = require('node-localStorage').LocalStorage;
const dotenv = require('dotenv');
const app = express();

dotenv.load();

const strategy = new Auth0Strategy({
    domain:       process.env.AUTH0_DOMAIN,
    clientID:     process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:  process.env.AUTH0_CALLBACK_URL
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    // profile has all the information from the user
    return done(null, profile);
});

localStorage = new LocalStorage('../localStorage');

// Initiating our Auth0Lock
var lock = new Auth0Lock(
  'zsGj9MpKLnBZcU3BPiLJeK4sXtLXzeof',
  'goldenheaven.eu.auth0.com'
);

// Listening for the authenticated event
lock.on("authenticated", function(authResult) {
  // Use the token in authResult to getUserInfo() and save it to localStorage
  lock.getUserInfo(authResult.accessToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }

    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('profile', JSON.stringify(profile));
  });
});

// ssl
app.set('trust proxy',config.ip);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());
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

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


app.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/users');
});

app.listen(config.port,config.ip);

module.exports = {
  'app': app,
  'ensureLoggedIn':ensureLoggedIn,
  'LocalStorage':localStorage
};