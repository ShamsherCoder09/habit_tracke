const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');
const passport = require('../config/passport-local-strategy');

router.get('/sign-up',usersController.signUp);
router.post('/create',usersController.create);
router.get('/create-session', passport.authenticate('local', { failureRedirect: '/users/sign-up' }), usersController.createSession);

//  route for sign up or sign in the user via google
router.get('/auth/google',passport.authenticate('google',{scope:['email','profile']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/'}),usersController.createSession);

router.get('/profile',passport.checkAuthentication,usersController.userProfile);

// to show form for forgotten password
router.get('/forgotten-password',usersController.forgottenPassword);

// to collect data from above form
router.post('/forgotten-password',usersController.forgottenPasswordEmailCollect);

// to show form for updating password
router.get('/reset-password/:token',usersController.resetPassword);

// to collect data from above form
router.post('/reset-password',usersController.updatePassword);


// to collect data from the user profile
router.post('/track-habit',usersController.trackHabit);

// to show calendar of the performance
router.get('/calendar',usersController.showCalendar);




// to signout the user
router.get('/sign-out',usersController.destroySession);



module.exports = router;