var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    isConfirm: Number,
    bill: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Bill'
    }]
});

module.exports = mongoose.model('Order', colorSchema)