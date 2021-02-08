var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var OrderHistorySchema = new mongoose.Schema({   
  
  Customer_id: String,

  Vehicle_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle'
    },

  Vehicle_Name: String,
  
  Vehicle_Image: String,

  Fuel_type_Name:String,

  Sub_Services_Details: String,

  Vehicle_Tracking_Status:String,

  Final_Amount_Payable:String,

  Track_Order:String,

});
OrderHistorySchema.plugin(timestamps);

mongoose.model('Service', OrderHistorySchema);

module.exports = mongoose.model('Service');