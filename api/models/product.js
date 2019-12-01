var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true},
    size: {type: String},
    amount: {type: Number},
    gender: {type: String},
    image: [String],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory'
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    }
});

module.exports = mongoose.model('Product', productSchema);