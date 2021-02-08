var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var PopularSubserviceSchema = new mongoose.Schema({   
  
  PopularService_id: String,

  PopularService_Name: String,

  Specifications: String,

  Vehiclename: Array,

  Price:String,

  Discount_Price: Number,

  Included: Array,

  Service_Image:String,

  Thumb_Line_Image:String,

});
PopularSubserviceSchema.plugin(timestamps);

mongoose.model('PopularSubservice', PopularSubserviceSchema);

module.exports = mongoose.model('PopularSubservice');