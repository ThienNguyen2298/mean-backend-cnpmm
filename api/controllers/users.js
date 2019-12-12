const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var jwt = require('jsonwebtoken');
const secret = "mean"

exports.users_register = (req, res, nex) => {
    console.log(req.body);
    User.find(
        {
            username: req.body.username
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Username exists'
                })
            }
            else {
                bcrypt.hash(req.body.password, null, null, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        let newUser = new User({
                            _id: new mongoose.Types.ObjectId,
                            name: req.body.name,
                            avatar: req.body.avatar,
                            username: req.body.username,
                            password: hash,
                            email: req.body.email,
                            phoneNumber: req.body.phoneNumber,
                            userType: req.body.userTypeId,
                        });
                        console.log(newUser);
                        newUser.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User created',
                                    userRegister: {
                                        _id: result._id,
                                        name: result.name,
                                        avatar: result.avatar,
                                        username: result.username,
                                        password: result.password,
                                        email: result.email,
                                        phoneNumber: result.phoneNumber,
                                        userType: result.userTypeId,
                                        request: {
                                            type: 'GET',
                                            url: 'http://localhost:8001/users/' + result._id
                                        }
                                    }
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            });
                    }
                })
            }
        })
        .catch(err => {
            console.log(err + '');
            res.status(500).json({
                error: err
            });
        });
};
module.exports.login = function(req, res) {
    var user = {
        username: req.body.username,
        password: req.body.password
    }
    passport.authenticate('local', function(err, user, info){
      var token;
        
      // If Passport throws/catches an error
      if (err) {
        res.status(404).json(err);
        return;
      }
  
      // If a user is found
      if(user){
        token = user.generateJwt();
        res.status(200);
        res.json({
          "token" : token
        });
      } else {
        // If user is not found
        res.status(401).json(info);
      }
    })(req, res);
  
  };
exports.users_login = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    User.find(
        {
            username: username
        })
        .exec()
        .then(user => {

            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Account not existed'
                })
            }
            console.log("password", password);
            console.log("user[0].password", user[0].password);

            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                }
                if (result) {
                    var token = jwt.sign({
                        user: user
                    }, secret, {
                        expiresIn: '10' // Expires in 24 hours
                    });
                    return res.status(200).json({
                        message: 'Auth successfully',
                        'token': token,
                        'user': user
                    })
                }
                return res.status(401).json({
                    message: 'Autn failed'
                });
            })

        });
}

exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}