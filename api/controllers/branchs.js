const mongoose = require('mongoose');
const Branch = require('../models/brand');

exports.branchs_get_all = (req, res, next) => {
    Branch.find()
        .select("_id name origin description product")
        .populate("product", "name price size amount gender image")
        .exec()
        .then(docs => {
            const resposne = {
                count: docs.length,
                branchs: docs.map(doc => {
                    return {
                        _id: doc.id,
                        name: doc.name,
                        origin: doc.origin,
                        description: doc.description,
                        product: doc.product,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8001/branchs'
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.branchs_get_by_id = (req, res, next) => {

    const id = req.params.branchId;
    console.log(id);
    Branch.findById(id)
        .select("_id name origin description product")
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:8001/branchs" + doc._id
                    }
                });
            }
            else {
                res
                    .status(404)
                    .json({
                        message: "No valid entry found for provided ID"
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.branchs_create_branch = (req, res, next) => {
    const branch = new Branch({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        origin: req.body.origin,
        description: req.body.description,
    });
    branch
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Create branch successfully!",
                createBranch: {
                    _id: result._id,
                    name: result.name,
                    origin: result.origin,
                    description: result.description,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8001/branchs/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

