var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const keys = require('./keys');
const User = require('../api/models/user');

passport.use(
    new FacebookTokenStrategy({
        // options for google strategy
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
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
    new GoogleTokenStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({
            id: profile.id
        }).then((currentUser) => {
            if (currentUser) {
                done(null, currentUser);
            }
            else {
                console.log(profile);
                new User({
                    id: profile.id,
                    name: profile.displayName,
                    avatar: profile._json.picture,
                    email: profile.emails[0].value,
                }).save().then((newGoogleUser) => {
                    done(null, newGoogleUser);
                });
            }
        });
    })
);
