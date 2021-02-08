var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var DriverbookingSchema = new mongoose.Schema({   
  
  Customer_Name: String,

  Customer_id: String,

  Customer_Phone: Number,

  Customer_Address: String,

  Customer_Email: String,

  Driver_Name: String,

  Driver_id: String,

  Driver_Phone: Number,

  Driver_Address: String,

  Driver_Email: String,

  Vehicle_Type : String,

  Pick_up_Location: String,

  Vehicle_Model :String,

  Pick_up_Date: String,

  Pick_up_Time: String,

  Round_trip :String,

  One_Trip :String,

  Vehicle_Image: String,

  Booking_Status: String,

});
DriverbookingSchema.plugin(timestamps);

mongoose.model('Driverbooking', DriverbookingSchema);

module.exports = mongoose.model('Driverbooking');