var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var AccessSchema = new mongoose.Schema({   
  
  Role_Name: String,

  Permissions: Array,

  Employee_id: String

});
AccessSchema.plugin(timestamps);

mongoose.model('Access', AccessSchema);

module.exports = mongoose.model('Access');