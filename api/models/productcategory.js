var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productCategory = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    description: {type: String},
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

module.exports = mongoose.model('ProductCategory', productCategory);