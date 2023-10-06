const User = require('../models/users');
const CalendarEvent = require('../models/calendar_events');
const mongoose = require('mongoose');
const userSignUpMailer = require('../mailers/user_sign_up_mailer');
const forgottenPasswordMailer = require('../mailers/fogotten_password_mailer');
const crypto = require('crypto');

module.exports.signUp = function (req, res) {
    // if user is already signed in don't show the signin page rather show profile page
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: 'User SignUp'
    })
}

// to fetch data from signUp form
module.exports.create = async function (req, res) {
    try {
        if (req.body.password != req.body.confirm_password) {
            // console.log('Password not matched!!');
            req.flash('error', 'Password not matched!');
            return res.redirect('back');
        }
        else {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                req.flash('error', 'email already registered!');
                return res.redirect('/');
            } else {
                const newUser = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                userSignUpMailer.signUp(newUser);
                req.flash('success', 'Account created Successfully!');
                return res.redirect('/');
            }
        }
    } catch (err) {
        console.log('error in creating user', err);
    }
}

// to create seesion of the user
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully!');
    return res.redirect('/users/profile');
}

// to render profile page
module.exports.userProfile = function (req, res) {
    return res.render('user_profile', {
        title: 'User Profile',
        showHeaderAndFooter: true
    });
};

// to show form for email filling of forgoteen password
module.exports.forgottenPassword = function (req, res) {
    return res.render('forgotten_password', {
        title: 'Forgot Password!'
    });
};

// to collect data from the above form
module.exports.forgottenPasswordEmailCollect = async function (req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = crypto.randomBytes(20).toString('hex');
            user.token = token;
            user.save();
            forgottenPasswordMailer.forgottenPassword(user.email, token);
            req.flash('success', 'Reset Email sent!');
            return res.redirect('/');
        } else {
            req.flash('error', 'Email not registered!');
            return res.redirect('/');
        }

    } catch (err) {
        console.log('error in finding user while reseting password', err);
    }
}

// render the update password form
module.exports.resetPassword = async function (req, res) {
    try {
        const user = await User.findOne({ token: req.params.token });
        if (user) {
            return res.render('reset_password', {
                title: 'Reset Password',
                user_id: user._id
            });
        } else {
            req.flash('error', 'Unauthorizzed Access');
            return res.redirect('back');
        }
    } catch (err) {
        console.log('error in sending maile', err);
        return res.redirect('back');
    }
}

// to collect password from above form and finally update the password of user
module.exports.updatePassword = async function (req, res) {
    try {
        const user = await User.findById(req.body.userId);
        if (user) {
            user.password = req.body.password;
            user.save();
            req.flash('success', 'Password updated Successfully');
            return res.redirect('/');
        } else {
            req.flash('error', 'Unauthorized Access');
            return res.redirect('/');
        }

    } catch (err) {
        console.log('error in updating password ', err);
        req.flash('error', 'Internal Server Error!!');
        return res.redirect('/');
    }
}

// to collect data from the user profile page of the user
module.exports.trackHabit = async function (req, res) {
    const user = res.locals.user;
    user.diet = req.body.diet;
    user.book = req.body.book;
    user.podcast = req.body.podcast;
    user.walk = req.body.walk;
    user.skincare = req.body.skincare;
    await user.save();

    if (user.diet === 'done' && user.book === 'done' && user.podcast === 'done' && user.walk === 'done' && user.skincare === 'done') {
        const date = new Date().toISOString().split('T')[0];
        if (user.calendarEvent) {
            // console.log('alreday exists');
            // console.log(user.calendarEvent._id);
            const calendarEvent = await CalendarEvent.findOne({ user: user._id });
            // console.log(calendarEvent.dates);
            calendarEvent.dates.push({ date: date });
            calendarEvent.save();
        } else {
            // console.log('new');
            let newCalendarEvent = new CalendarEvent({
                user: user._id,
                // dates:[{date:date},{date:'2023-06-01'}]
                dates: [{ date: date }]
            });
            newCalendarEvent.save();
            user.calendarEvent = newCalendarEvent.id;
            await user.save();
        }
    }

    // const trackedHabitCount = trackedHabits.reduce((count, habit) => {
    //     if (user[habit] === 'done') {
    //         count++;
    //         const date = new Date().toISOString().split('T')[0];
    //         // console.log(date);
    //         calendarEvent = new CalendarEvent({
    //             user: user.id,
    //             habit: habit,
    //             dates: [{ date: date },{date:'2023-06-01'}],
    //         });
    //         calendarEvent.save();
    //         console.log(calendarEvent.dates);
    //     }
    //     return count;
    // }, 0);

    // if (trackedHabitCount === trackedHabits.length) {
    //     user.calendarEvent = (calendarEvent.id);
    //     await user.save();
    // }

    req.flash('success', 'Habit for today Tracked Successfully!');
    return res.redirect('/users/calendar');
};


// to show calendar 
module.exports.showCalendar = async function (req, res) {
    try {
        const user = res.locals.user;
        if(user){
        const calendarEventId = user.calendarEvent._id;
        const calendarEvent = await CalendarEvent.findById(calendarEventId);
        // console.log(calendarEvent);
        const calendarEventDates = calendarEvent.dates.map(dateObj => {
            return { date: dateObj.date.toISOString().split('T')[0] };
        });
        // console.log(calendarEventDates);


        return res.render('calendar', {// Render the 'calendar' view 
            title: 'Calendar',
            calendarEventDates: calendarEventDates
        }
        );
    }
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


































// to sign out the user
module.exports.destroySession = function (req, res) {
    req.logout(function (err) {
        if (err) {
            req.flash('error', 'Something Went Wrong!!');
        }
        req.flash('success', 'Logged out successfully!!');
        return res.redirect('/');
    });
}