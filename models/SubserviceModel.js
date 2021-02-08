var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var SubserviceSchema = new mongoose.Schema({   
  
  Service_id:{
          type: Schema.Types.ObjectId,
          ref: 'Service'
      },
  
  sub_ser_Title: String,

  sub_ser_image: String,

  Count_type : Boolean,

  sub_ser_Spec1: Array,

  Original_Price: Number,

  Discount_Price: Number,

  sub_ser_display_img: Array,

  ItemList: Array,

  Vehicle_Name_id: [{
          type: Schema.Types.ObjectId,
          ref: 'VehicleName'
      }],

  Cart_Status: Boolean,


  Cart_count : Number
  //Vehicle_manufacturer : String,
  
  //Vehicle_Model :String,
  
  //Vehicle_fuel_type : String,

});
SubserviceSchema.plugin(timestamps);
mongoose.model('Subservice', SubserviceSchema);

module.exports = mongoose.model('Subservice');