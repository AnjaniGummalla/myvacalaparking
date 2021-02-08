var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var PickupboySchema = new mongoose.Schema({   
  
  Pickupboy_Name: String,

  Phone: Number,

  DL_Number: String,

  Vendor_Id: String,

  Status:{
  	type: String,
  	Default: "active"
  },

  Image: String

});
PickupboySchema.plugin(timestamps);
mongoose.model('Pickupboy', PickupboySchema);

module.exports = mongoose.model('Pickupboy');