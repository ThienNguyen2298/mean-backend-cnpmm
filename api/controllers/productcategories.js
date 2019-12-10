const mongoose = require('mongoose');
const ProductCategory = require('../models/productcategory');

exports.productcategories_get_all = (req, res, next) => {
    ProductCategory.find()
        .select("_id name description product")
        .populate("product", "name price size amount gender image")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        description: doc.description,
                        product: doc.product,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8001/productcategories/' + doc._id
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


exports.productcategories_create_productcategory = (req, res, next) => {
    const productCategory = new ProductCategory({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        product: req.body.productId
    });
    console.log(productCategory);
    productCategory
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Create product successfully!",
                createProductCategory: {
                    _id: result._id,
                    name: result.name,
                    description: result.description,
                    product: result.product,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8001/productcategories/' + result._id
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

exports.productcategories_get_productcategory = (req, res, next) => {
    const id = req.params.productCategoryId;
    ProductCategory.findById(id)
        .select("_id name price size amount gender image")
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:8001/productcategories"
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

exports.productcategories_update_productcategory = (req, res, next) => {
    //console.log(req.body);
    const id = req.params.productCategoryId;
    console.log("id",id);
    
    const updateOps = new ProductCategory({
        name: req.body.name,
        description: req.body.description
    });
    
    console.log("data",updateOps);
    //console.log(req.body);
    ProductCategory.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product Category updated",
                request: {
                    type: "GET",
                    url: "http://localhost:8001/productcategories/" + id
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

exports.productcategories_delete = (req, res, next) => {
    const id = req.params.productCategoryId;
    ProductCategory.remove({
        _id: id
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product category deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:8001/productcategories",
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