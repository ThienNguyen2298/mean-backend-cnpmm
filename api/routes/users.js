// User routes
var express = require('express');
var router = express.Router();
const UserController = require('../controllers/users');

router.post('/register', UserController.users_register);

router.post('/login', UserController.users_login);

router.delete('/:userId', UserController.user_delete);
//export usertype route
module.exports = router;