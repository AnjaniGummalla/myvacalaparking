var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
var ParkingLocationSchema = new mongoose.Schema({   
  
  Location_Name: String,

  Pincodes: Array,
  
  Image: String,

  Lat: Number,

  Long: Number,

  Display_Name: String,

  Disable: Boolean

});
ParkingLocationSchema.plugin(timestamps);

mongoose.model('ParkingLocation', ParkingLocationSchema);

module.exports = mongoose.model('ParkingLocation');