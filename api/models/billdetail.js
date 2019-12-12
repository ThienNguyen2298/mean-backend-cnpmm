var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billDetailSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    quantity: Number,
    bill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bill'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
});

module.exports = mongoose.model('BillDetail', billDetailSchema);