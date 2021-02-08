var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var RoleSchema = new mongoose.Schema({   
  
  Role_Name: String,

});
RoleSchema.plugin(timestamps);

mongoose.model('Role', RoleSchema);

module.exports = mongoose.model('Role');