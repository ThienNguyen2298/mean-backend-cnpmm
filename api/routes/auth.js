const router = require('express').Router();
const passport = require('passport')
//auth login


//auth logout 
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

const authCheck = (req, res, next) => {
    if (!req.user) {
        res.json({
            message: 'User is not logged in',
            success: false
        });
    }
    else {
        res.json({
            message: 'User is logged in',
            success: true
        })
    }
};

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

// callback router for google to redirect 
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.json(req.user);
});


// auth with facebook
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email']
}), (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});

// Callback rotuer for facebook to redirect
router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
    res.json({
        message: 'User info',
        user: req.user
    });
});

// auth with local 



module.exports = router;