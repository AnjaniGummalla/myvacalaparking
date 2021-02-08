var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var VehicleModelSchema = new mongoose.Schema({   
  
  VehicleModel_Name: String,

   VehicleModel_Image: String,

   Vehicle_Type: String

   //Fuel_id:String,
});

VehicleModelSchema.plugin(timestamps);

mongoose.model('VehicleMode', VehicleModelSchema);

module.exports = mongoose.model('VehicleMode');