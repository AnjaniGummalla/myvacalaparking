var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
var LocationSchema = new mongoose.Schema({   
  
  Location_Name: String,

  Pincodes: Array,
  
  Image: String,

  Lat: Number,

  Long: Number,

  Display_Name: String,

  Disable: Boolean

});
LocationSchema.plugin(timestamps);

mongoose.model('Location', LocationSchema);

module.exports = mongoose.model('Location');