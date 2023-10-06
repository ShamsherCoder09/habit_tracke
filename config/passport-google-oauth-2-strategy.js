const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');

passport.use(new googleStrategy({
    clientID : '561643703493-6q8nbu8tp7r47jjn0r49erq74n5us0a4.apps.googleusercontent.com',
    clientSecret:'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',
    callbackURL:'http://127.0.0.1:8000/users/auth/google/callback'
    },
    async function(accessToken,refreshToken,profile,done){
        try{
            const user = await User.findOne({email:profile.emails[0].value}).exec();
            if(user){
                return done(null,user);
            }else{
                const newUser = await User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex')
                })
                return done(null,newUser);
            }

        }catch(err){
            console.log('error in authentication using google',err);
            return;
        }

    }


));

// module.exports = googleStrategy;