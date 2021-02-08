var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var CustomerAltLocationSchema = new mongoose.Schema({   
  
  City: String,

  Customer_id: String,

  Pincode: String,

  Customer_alt_Location: {
        type: { type: String },
        coordinates: []
    },

  lat: Number,

  long: Number,
  
  Loction_type: String,

  State: String,

  Country: String,

  Street: String,

  NearBy_LandMark: String,

  Location_NickName:String,

  Flat_No : String

});
CustomerAltLocationSchema.plugin(timestamps);

CustomerAltLocationSchema.index({ "Customer_alt_Location": "2dsphere" });

mongoose.model('Customeraltlocation', CustomerAltLocationSchema);

module.exports = mongoose.model('Customeraltlocation');