require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const createInitialSession = require(`${__dirname}/middleware/session-check`)
const massive = require('massive')
const cors = require('cors')
const session = require('express-session')
const auth_controller = require('./auth_controller')


const app = express();
app.use(bodyParser.json());
app.use(cors());

// app.use( express.static( `${__dirname}/../../build` ) );

let userStuff;



massive(process.env.CONNECTIONSTRING).then(db => {
    app.set('db', db);
})
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
//////////////////////////////    Authentication \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK
}, function (accessToken, refreshToken, extraParams, profile, done) {
    const db = app.get('db');
    db.users.find_user(profile.id).then(user => {
        if (user[0]) {
            userStuff = true
            return done(null, user);
        } else {
            userStuff =  false
            db.users.create_user([profile.displayName, profile.emails[0].value, profile.picture, profile.id])
                .then(user => {
                    return done(null, user);
                })
        }
    })
}))

passport.serializeUser((user, done) => {
    console.log('serializing', user)
})

//USER COMES FROM SESSION - INVOKED ON EVERY ENDPOINT.
passport.deserializeUser((obj, done) => {
    return done(null, obj[0]);
})
app.get('/login', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/#/logged',
    failureRedirect: 'http://localhost:3000/#/'
}));

app.get('/login/user', auth_controller.login);
app.get('/logout', auth_controller.logout);


app.get('/auth/authorized', (req, res) => {
    if (!req.user) {
        return res.status(403).send(false)
    } else {
        return res.status(200).send(req.user);
    }
})

//
////
//////
////////////////////////////        SERVER GETS         /////////////////////////////////
//////
////
//


/////// USERS \\\\\\\\\\\\\\\

app.get('/api/users', users_controller.get_users)
app.get('/api/users/user/:id', users_controller.get_user_by_id)
app.post('/api/adduser', users_controller.create_user)


app.delete('/api/delete/user/:id', users_controller.delete_user)

const port = 3005;
app.listen(port, ()=>{
    console.log(`Listening_on_port_${port}`)
})

// const path = require('path')
// app.get('*', (req, res)=>{
//   res.sendFile(path.join(__dirname, '../build/index.html'));
// })