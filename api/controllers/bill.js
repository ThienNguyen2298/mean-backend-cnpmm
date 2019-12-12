const mongoose = require('mongoose');
const Bill = require('../models/bill');
const BillDetail = require('../models/billdetail');
const sendMail = require('../middleware/send-email');

exports.bill_create = (req, res, next) => {
    var date = new Date();
    const bill = new Bill({
        _id: new mongoose.Types.ObjectId(),
        dateCreated: date,
        userOrder: req.body.userOrder,
        totalCost: req.body.totalCost,
        isConfirm: 0
    });

    console.log('Bill Model', bill);

    bill.save()
        .then(result => {
            console.log('Bill:', result);
            var url = "http://localhost:4200/bills/confirm-order/" + result._id;
            sendMail(url, result.totalCost, req.body.userEmail);
            res.status(200).json({
                message: "Create Bill successfully!",
                bill: {
                    _id: result._id,
                    dateCreated: result.dateCreated,
                    userOrder: result.userOrder,
                    totalCost: result.totalCost
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

exports.bill_confirm_order = (req, res, next) => {
    const id = req.params.billId;
    console.log('Id', id);
    const bill = new Bill();
    Bill.findById(id)
        .then(result => {
            const bill = new Bill({
                _id: result._id,
                dateCreated: result.dateCreated,
                totalCost: result.totalCost,
                isConfirm: 1
            });
            Bill.update({ _id: id }, { $set: bill })
                .exec()
                .then(result => {
                    res.status(201).json({
                        message: 'Confirm Success',
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.billDetail_create = (req, res, next) => {
    const billDetai = new BillDetail({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        bill: req.body.billId,
        product: req.body.productId
    });

    billDetai.save().then(result => {
        console.log('Bill detail', result);
        res.status(200).json({
            'billdetail': result
        });
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
}

exports.bill_get = (req, res, next) => {
    const id = req.query.id;
    console.log("ID", id);
    Bill.findById(id)
        .select("_id userOrder totalCost isConfirm billDetail")
        .populate("userOrder", "_id name email")
        .exec()
        .then(doc => {
            if (doc) {
                BillDetail.find({
                    billId: doc._Id
                })
                    .select("_id quantity product")
                    .populate("product", "name price size amount gender image")
                    .exec()
                    .then(result => {
                        console.log(result);
                        res.status(200).json({
                            'billDetai': result,
                            'bill': doc
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
            }
            else {
                res.status(404).json({
                    message: 'Bill not found',
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}