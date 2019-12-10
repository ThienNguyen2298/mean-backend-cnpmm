const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./keys');
const User = require('../api/models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user.id);
    });
});
    
passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({
            id: profile.id
        }).then((currentUser) => {
            if (currentUser) {
                done(null, currentUser);
            }
            else {
                new User({
                    id: profile.id,
                    name: profile.displayName,
                    avatar: profile.photos[0].value,
                    email: profile.emails[0].value,
                }).save().then((newGoogleUser) => {
                    done(null, newGoogleUser);
                });
            }
        });
    })
);

passport.use(
    new FacebookStrategy({
        // options for google strategy
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: '/auth/facebook/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({
            id: profile.id
        }).then((user) => {
            if (user) {
                done(null, user);
            }
            else {
                new User({
                    id: profile.id,
                    name: profile.displayName,
                }).save().then((newFbUser) => {
                    done(null, newFbUser);
                });
            }
        });
    })
);

passport.use(
    new LocalStrategy(
        function(username, password, done) {
            
        }
    )
)
