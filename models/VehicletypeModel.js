var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var VehicletypeSchema = new mongoose.Schema({   
  
  Vehicle_Type: String,

  // Vehicle_Image:String,

  // Vehicle_Name: String,
  
  // Vehicle_Brand:  String,

  // Vehicle_Fuel: Array

});

VehicletypeSchema.plugin(timestamps);

mongoose.model('Vehicletype', VehicletypeSchema);

module.exports = mongoose.model('Vehicletype');