var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var SupervisorSchema = new mongoose.Schema({   
  
  Name: String,

  Email:String,

  Type : Number,

  Phone : Number,
           
  Password : String,
           
  Profile_Pic : String,

  Customer_id: String,

  Number_of_parking_booked: String,

  Parkingslots_availability: String,

  Vehicles_Entered_Bookings : String,

  Currently_Inside: String,

  Vehicles_Outside_Bookings: String,

});
SupervisorSchema.plugin(timestamps);
mongoose.model('Supervisor', SupervisorSchema);

module.exports = mongoose.model('Supervisor');