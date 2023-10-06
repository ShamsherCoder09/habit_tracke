const express = require('express');
const app = express();
const port = 8000;

// require database
const db = require('./config/mogoose');
const layout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');

// set up the express session and passport
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

// to set up the google authentcaiton
const googleStrategy = require('./config/passport-google-oauth-2-strategy');

// set up the flash
const connectFlash = require('connect-flash');
const customMware = require('./config/middleware');




// to use ejs layouts
app.use(layout);

// to use cookie-parser and urlencoded
app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// to set view engine
app.set('view engine','ejs'); 
app.set('views','./views');

// set up the mongo store using mongo store
app.use(session({
    name:'habit_tracker',
    secret:'helloworld!',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*80*60)
    },
    store:new MongoStore({
        mongoUrl:'mongodb://127.0.0.1/habit_tracker_db'
    },
    {
        mongooseConnection:db,
        autoRemove :'disabled'
    },function(err){
        console.log(err || 'succssfully added mongostore');
    }
    )
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// using connect flash to show notifications
app.use(connectFlash());
app.use(customMware.setFlash);

// to use routes
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log('errror in running up express server',err);
    }
    console.log('Server is Running on port : ',port);
})