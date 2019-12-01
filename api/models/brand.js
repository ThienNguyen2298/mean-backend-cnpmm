var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var brandSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    origin: String,
    description: String,
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

module.exports = mongoose.model('Branch', brandSchema);