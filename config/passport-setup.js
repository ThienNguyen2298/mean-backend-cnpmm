var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const keys = require('./keys');
const User = require('../api/models/user');
var LocalStrategy = require('passport-local').Strategy;

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

passport.use(new LocalStrategy({
  usernameField: 'email'
},
function(username, password, done) {
  User.findOne({ username: username }, function (err, user) {
    if (err) { return done(err); }
    // Return if user not found in database
    if (!user) {
      return done(null, false, {
        message: 'User not found'
      });
    }
    // Return if password is wrong
    if (!user.comparePassword(password)) {
      return done(null, false, {
        message: 'Password is wrong'
      });
    }
    // If credentials are correct, return the user object
    return done(null, user);
  });
}
));