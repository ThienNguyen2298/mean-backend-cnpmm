var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    dateCreated: { type: Date },
    userOrder: { type: String, ref: 'User' },
    totalCost: Number,
    isConfirm: Number,
    billDetail: [{
        type: mongoose.Types.ObjectId,
        ref: 'BillDetail'
    }]
});

module.exports = mongoose.model('Bill', billSchema);