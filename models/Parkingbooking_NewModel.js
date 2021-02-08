var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var parkingbooking_NewSchema = new mongoose.Schema({  
  
  Booking_Id: String,  

  Parkingdetails_Id:  
  {
        type: Schema.Types.ObjectId,
        ref: 'parkingdetails'
  },
  
  Vehicle_Type_Id : {
        type: Schema.Types.ObjectId,
        ref: 'Vehicletype'
  },
  Vehicle_Id: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle'
  },
  Booking_Start_Date : Date,
  
  Booking_End_Date : Date,

  Booking_Start_Time : Date,
  
  Booking_End_Time : Date,
  
  Customer_Id :  {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
  },
  Total_Amount : Number,
  
  Pricing_Type: String,
  
  Hourly_Count: Number,

  Month_Count:Number,
  
  Days_Count:Number,

  Booking_Status : String,

  Slot_Details : String,

  Extra_Charge: String,

  Extra_Time: String,
  
  Check_In_Date: Date,
  
  Check_Out_Date:Date,

  slot_details: String,

  distance: String,

  Kms: String,

  duration_date: String,

  couponcode: String,

  couponcode_amount: String

  
});
parkingbooking_NewSchema.plugin(timestamps);
mongoose.model('parkingbooking_New', parkingbooking_NewSchema);
module.exports = mongoose.model('parkingbooking_New');

