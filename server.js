// Call package
const cors = require('cors');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportfb = require('passport-facebook').Strategy;
const session = require('express-session');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT || 8001; // Set the port to the app
const mongoose = require('mongoose');

const User = require('./api/models/user');
const router = express.Router();

app.use(session({
  secret: "dinhzxczxczxczxczxcdvasfdssdfsd"
}))

app.use(cors());

//Routes
const productRoutes = require('./api/routes/products');
const productCategoryRoutes = require('./api/routes/productcategories');
const userRoutes = require('./api/routes/users');
const userTypeRoutes = require('./api/routes/usertypes');
const branchRoutes = require('./api/routes/branchs');

// const authRoutes = require('./api/routes/auth');


// const userRoute = require('./api/routes/userroute');
// const usertypeRoute = require('./api/routes/usertyperoute');
// DB Config
const db = require('./keys').mongoURI;
//connection mongoDB
mongoose
  .connect(db, { useUnifiedTopology: true }) // Let us remove that nasty deprecation warrning :)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//Get an instace of the express router

var apiRouter = express.Router();

//App configuration
//User body-parser 

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

//thien add
app.use(passport.initialize());
app.use(passport.session());

//Configuration app to handle CROS requests

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
}); 


// Log all requests to the console
app.use(morgan('dev'));




// Declare routes here
app.use('/products', productRoutes);
app.use('/productcategories', productCategoryRoutes);
app.use('/user', userRoutes);
app.use('/usertypes', userTypeRoutes);
app.use('/branchs', branchRoutes);

// Login social appilcation

app.get('/auth/fb', passport.authenticate('facebook', {
  scope: ['email']
}));


app.get('/auth/fb/callback', passport.authenticate('facebook', {
  // failureRedirect: '/',
  // successRedirect: 'http://localhost:4200/home'
}));

passport.use(new passportfb(
  {
    clientID: "534209673828624",
    clientSecret: "341d64549bec947dd744773da91fc823",
    callbackURL: "http://localhost:8001/auth/fb/callback",
    profileFields: ['email', 'gender', 'displayName']
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    User.findOne({ email: profile._json.email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, user);
      }

      if (user == null) {
        let newUser = new User({
          _id: new mongoose.Types.ObjectId,
          name: profile.displayName,
          email: profile._json.email,
        });
        newUser.save();
        return done(null, newUser);
      }
    })
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
});

passport.deserializeUser((id, done) => {
  User.findOne({
    id: id
  }, (err, user) => {
    done(null, user)
  })
});

// START THE SERVER
// ==========
app.listen(port);
console.log('Port must be use is: ' + port);