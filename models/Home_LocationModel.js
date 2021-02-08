var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var CustomerHomeLocationSchema = new mongoose.Schema({   
  
  City: String,

  Customer_id: String,

  Pincode: String,

  Customer_Home_Location: {
        type: { type: String },
        coordinates: []
    },
  State: String,

  Country: String,

  Street: String,

  NearBy_LandMark: String,

  Location_NickName:String,

  Flat_No : String

});
CustomerHomeLocationSchema.plugin(timestamps);

CustomerHomeLocationSchema.index({ "Customer_Home_Location": "2dsphere" });

mongoose.model('CustomerHomelocation', CustomerHomeLocationSchema);

module.exports = mongoose.model('CustomerHomelocation');