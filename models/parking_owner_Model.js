var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var parkingownerSchema = new mongoose.Schema({  

  owner_name:  String,
  owner_email : String,
  owner_pri_contact : Number,
  owner_sec_contact : Number,
  owner_pan_no : String,
  owner_pan_file : String,
  owner_aadhar_no : String,
  owner_aadhar_file : String,
  owner_res_address : String,

});

parkingownerSchema.plugin(timestamps);

mongoose.model('parkingowner', parkingownerSchema);

module.exports = mongoose.model('parkingowner');

