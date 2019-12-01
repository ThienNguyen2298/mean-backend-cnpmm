var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var colorSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    colorName: String,
    colorCode: String,
    product: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product'
    }]
});

module.exports = mongoose.model('Color', colorSchema)