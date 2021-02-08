var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var PopularServiceSchema = new mongoose.Schema({  

  Heading: String, 
  
  Popular_Service_Name: String,

  // Popular_Service_Name: {
  //       type: Schema.Types.ObjectId,
  //       ref: 'Service'
  //   },

  Sub_Title: String,

  //Master_Service_id: String,
  
  Vehicle_Name: Array,

  //Vehicle_Name_id:String,

  Service_Image: String,

  //Master_Service_Name:String,

  //Vehicle_Type_id:String,

  Desc: String

});
PopularServiceSchema.plugin(timestamps);

mongoose.model('PopularService', PopularServiceSchema);

module.exports = mongoose.model('PopularService');