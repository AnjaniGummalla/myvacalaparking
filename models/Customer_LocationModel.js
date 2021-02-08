var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var CustomerLocationSchema = new mongoose.Schema({   
  
  City: String,

  Customer_id: String,

  Pincode: String,

  Customer_Location: {
        type: { type: String },
        coordinates: []
    },
  State: String,

  lat: Number,

  long: Number,
  
  Location_type:{
    type:  String,
    Default: "Home"
  },

  Country: String,

  Street: String,

  NearBy_LandMark: String,

  Location_NickName:String,

  Status: String,

  Flat_No : String

});
CustomerLocationSchema.plugin(timestamps);
CustomerLocationSchema.index({ "Customer_Location": "2dsphere" });
mongoose.model('Customerlocation', CustomerLocationSchema);

module.exports = mongoose.model('Customerlocation');