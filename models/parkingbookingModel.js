var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var parkingbookingSchema = new mongoose.Schema({  
  parkingdetails:  {
        type: Schema.Types.ObjectId,
        ref: 'parkingdetails'
  },
  
  slot_details : String,

  parkingdetails_id: String,
  
  Vehicle_type_id : {
        type: Schema.Types.ObjectId,
        ref: 'Vehicletype'
  },
  Vehicle_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle'
  },
  Vehicle_details: [{
        type: Schema.Types.ObjectId,
        ref: 'Vehicle'
  }],
  booking_start_date : String,
  booking_end_date : String,
  booking_start_time : String,
  booking_end_time : String,
  total_amount : Number,
  total_hrs : String,
  Price_Details : String,
  Booking_id : String,
  Booked_Date_and_Time : String,

  additional_booking_hrs : String,
  additonal_booking_amount : String,
  Overall_time_duraion : String,
  Overall_amount_paid : String,
  Customer_id :  {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
  },
  Booking_status : String,
  Checking_date : String,
  Checking_time : String,
  Checkout_date : String,
  Checkout_time : String,
  total_checking_duration : String,
  attach_pic : String,

 //Mobile/////

  distance : String,
  Kms : String,
  parking_shop_name :  String,
  parking_shop_address : String,
  parking_shop_address_link : String,
  amount : String,
  floor : String,
  block : String,
  slot : String,

  duration_date : String,

  couponcode : String,
  couponcode_amount : String,
  Original_amount : String,
  last_admin_update_status :  String,
  admin_status_update_time : String,


});
parkingbookingSchema.plugin(timestamps);
mongoose.model('parkingbooking', parkingbookingSchema);
module.exports = mongoose.model('parkingbooking');

