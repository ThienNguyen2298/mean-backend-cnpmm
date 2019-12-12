// Call package
// const cors = require('cors');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT || 8001; // Set the port to the app
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');

const sendMail = require('./api/middleware/send-email')

//Configuration app to handle CROS requests
// app.use(cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type, Authorization");
  next();
});



app.use(cookieSession({
  maxAge: 4 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));


//inititlize passport
app.use(passport.initialize());
app.use(passport.session());

//Routes
const productRoutes = require('./api/routes/products');
const productCategoryRoutes = require('./api/routes/productcategories');
const userRoutes = require('./api/routes/users');
const userTypeRoutes = require('./api/routes/usertypes');
const branchRoutes = require('./api/routes/branchs');
const authRoutes = require('./api/routes/auth');
const billRoutes = require('./api/routes/bill');

const passportSetup = require('./config/passport-setup');


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



// Log all requests to the console
app.use(morgan('dev'));


// Declare routes here
app.use('/products', productRoutes);
app.use('/productcategories', productCategoryRoutes);
app.use('/user', userRoutes);
app.use('/usertypes', userTypeRoutes);
app.use('/branchs', branchRoutes);
app.use('/auth', authRoutes(app, express, passport));
app.use('/bills', billRoutes);

console.log('--------------------------------------------------------');

// START THE SERVER
// ==========
app.listen(port);
console.log('Port must be use is: ' + port);