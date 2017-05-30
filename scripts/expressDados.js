const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config.js');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const Auth0Strategy = require('passport-auth0');
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

app.listen(config.port,config.ip);

module.exports = {
  'app': app,
  'ensureLoggedIn': ensureLoggedIn,
  'passport',passport
};