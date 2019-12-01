const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select("_id name price size amount gender image category branch")
        .populate("category", "_id name description")
        .populate("branch", "_id name origin description")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        size: doc.size,
                        amount: doc.amount,
                        gender: doc.gender,
                        image: doc.image,
                        category: doc.category,
                        branch: doc.branch,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8001/products/' + doc._id
                        }
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.products_create_product = (req, res, next) => {
    console.log(req.body);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        amount: req.body.amount,
        gender: req.body.gender,
        image: req.body.image,
        category: req.body.categoryId,
        branch: req.body.branchId
    });

    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Create product successfully!",
                createProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    size: result.size,
                    amount: result.amount,
                    gender: result.gender,
                    image: result.image,
                    category: result.category,
                    branch: result.branch,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8001/products/' + result._id
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

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select("_id name price size amount gender image category branch")
        .populate("category", "_id name description")
        .populate("branch", "_id name origin description")
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:8001/products" + doc._id
                    }
                });
            } else {
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

exports.products_update_product = (req, res, next) => {
    console.log(req.body);
    const id = req.params.productId;
    const productUp = new Product({
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        amount: req.body.amount,
        gender: req.body.gender,
        image: req.body.image,
        category: req.body.categoryId,
        branch: req.body.branchId
    });
    Product.update({ _id: id }, { $set: productUp })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product updated",
                request: {
                    type: "GET",
                    url: "http://localhost:8001/products/" + id
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

exports.products_delete = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:8001/products",
                    body: { name: "String", price: "Number" }
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