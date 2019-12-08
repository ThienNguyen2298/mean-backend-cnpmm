var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    name: String,
    avatar: String,
    username: { type: String, index: { unique: true } },
    password: { type: String },
    email: { type: String, index: { unique: true } },
    phoneNumber: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    sex: { type: Number },
    userType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserType'
    }
});
userSchema.methods.comparePassword = function (password) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        var user = this;
        return bcrypt.compareSync(password, user.password)
    });
}
module.exports = mongoose.model('User', userSchema);