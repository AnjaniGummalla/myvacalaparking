var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
var timestamps = require('mongoose-timestamp');
var UserSchema = new mongoose.Schema({   
  
  Name: String,
  Email:String,
  Password: String,
  Type:  Number,
  Phone: Number,
  Profile_Pic: String,
  Designation : String,
  AuthToken: String,

});

UserSchema.pre('save', async function(next) {
    const user = this;
    var hash = '';
    if (user.Password != "") {
        hash = await bcrypt.hash(this.Password, 10);
    }
    this.Password = hash;
    next();
});

UserSchema.methods.isValidPassword = async function(Password) {
    const user = this;
    if (user.password == "") {
        return false;
    }
    const compare = await bcrypt.compare(Password, user.Password);
    return compare;
};
UserSchema.plugin(timestamps);
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');