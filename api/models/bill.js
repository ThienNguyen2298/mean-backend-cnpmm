var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dateCreated: {type: Date, required: true},
    userOrder: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    totalCost: Number,
    billDetail: [{
        type: mongoose.Types.ObjectId,
        ref: 'BillDetail'
    }]
});

module.exports = mongoose.model('Bill', billSchema);