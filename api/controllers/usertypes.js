var UserType = require('../models/usertype');
var mongoose = require('mongoose');

exports.usertypes_get_all = (req, res, next) => {
    UserType.find()
        .select("_id name description user")
        .populate("user", "name avatar username password email phonenumber address dateofbirth sex")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                usertypes: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        description: doc.description,
                        user: doc.user,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8001/usertypes/' + doc._id
                        }
                    };
                })
            };
            res.status(200).json(response);
        });
}

exports.usertypes_create = (req, res, next) => {
    const userType = new UserType({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description:req.body.description
    });
    userType.save()
    .then(result => {
        res.status(201).json({
            message: 'Create usertype successfully',
            createUserType: {
                _id: result._id,
                name: result.name,
                description: result.description,
                request: {
                    type: 'POST',
                    url: 'http://localhost:8001/usertypes/' + result._id
                }
            }
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.usertypes_update = (req, res, next) => {
    UserType.findById(req.params.userId)
        .then((user) => {
            if (req.body.name) {
                user.name = req.body.name;
            }
            if (req.body.description) {
                user.description = req.body.description;
            }
            user.save(function (err) {
                if (err) {
                    console.log("Update failed");
                }
                res.json({
                    message: 'Update UserType success!'
                })
            })
        })
        .catch(err => {
            res.json({
                message: 'Not found User from UserId'
            })
        });
}

exports.usertypes_delete = (req, res, next) => {
    UserType.remove({
        _id: req.params.userId
    }, function (err, user) {
        if (err) return res.send(err)
        res.json({
            message: 'Successfully deleted'
        });
    })
}