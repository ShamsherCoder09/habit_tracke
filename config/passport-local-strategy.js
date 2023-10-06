const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const bcrypt = require('bcrypt');

// serializing user to decide which key is to be set in cookie
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deserializing user from the key in the cookie
passport.deserializeUser(async function(id,done){
    try{
        const user = await User.findById(id);
        return done(null,user);
    }catch(err){
        console.log('error in finding user --> passport',err);
        return done(err);
    }
});

// authenticatin using passport
passport.use(new LocalStrategy(
    {
    usernameField:'email',
    passReqToCallback:true
    },
    async function(req,email,password,done){
        try{
            const user = await User.findOne({email:email});
            let isMatch;
            if(user){ // if user is present then only try to match password else not match
            isMatch = await bcrypt.compare(password,user.password);
            }
            if(!user){
                // console.log('Email not registered!');
                req.flash('error','Email not Registered!');
                return done(null,false);
            }else if(!isMatch){
                req.flash('error','Invalid Password!');
                return done(null,false);
            }
            req.flash('success','Logged in Successfully!');
            return done(null,user);

        }catch(err){
            console.log('error in passport local strategy establishing the user!',err);
        }
    }
));

// check if the user is authenticated 
passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        return res.redirect('/');
    }
}

// stet the authenctaiated user
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;