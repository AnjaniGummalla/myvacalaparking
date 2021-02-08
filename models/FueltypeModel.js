var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var FueltypeSchema = new mongoose.Schema({   
  
  Fuel_Type: String,

  Background_Color:String,
  Background_Color_name : String,
});

FueltypeSchema.plugin(timestamps);

mongoose.model('Fuel_Type', FueltypeSchema);

module.exports = mongoose.model('Fuel_Type');