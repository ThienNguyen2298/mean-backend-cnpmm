// Call package
var cors = require('cors');
var jwt = require('jsonwebtoken');
const passport = require('passport');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var port = process.env.PORT || 8001; // Set the port to the app
var mongoose = require('mongoose');

app.use(cors());

//Routes
const productRoutes = require('./api/routes/products');
const productCategoryRoutes = require('./api/routes/productcategories');
const userRoutes = require('./api/routes/users');
const userTypeRoutes = require('./api/routes/usertypes');
const branchRoutes = require('./api/routes/branchs');


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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
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
// app.use('/usertypes', usertypeRoute);
// app.use('/users', userRoute)
// 

// START THE SERVER
// ==========
app.listen(port);
console.log('Port must be use is: ' + port);