var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    name: String,
    avatar: String,
    username: { type: String },
    password: { type: String, },
    email: { type: String },
    phoneNumber: { type: String, },
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
userSchema.methods.generateJwt = function() {
    
    return jwt.sign({
      id: this._id,
      username: this.username,
      name: this.name
     
    }, "mean", {
        expiresIn: 60 // Expires in 24 hours
    }); // DO NOT KEEP YOUR SECRET IN THE CODE!
  };
module.exports = mongoose.model('User', userSchema);