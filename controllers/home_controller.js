module.exports.entryPage = function (req, res) {
    // if user is already signed in don't show the signin page rather show profile page
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('entry_page', {
        title: 'home',
        showHeaderAndFooter: false
    })
}