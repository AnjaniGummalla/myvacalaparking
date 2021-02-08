var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var ServicesbannerSchema = new mongoose.Schema({   
  
  ServiceBanner_Image: String,

  Master_Service_id: String,

 //Master_Service_Name:String,

  Title: String,

  Status:String,

  Desc: String,

});
ServicesbannerSchema.plugin(timestamps);
mongoose.model('ServicesBanner', ServicesbannerSchema);

module.exports = mongoose.model('ServicesBanner');