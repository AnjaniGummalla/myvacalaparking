var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var ServicebookingSchema = new mongoose.Schema({   
  
  Customer_Name: String,

  Customer_id: String,

  Booking_id: String,

  Booking_Mode: String,

  Customer_Phone: Number,

  Customer_Address: Array,

  Customer_Email: String,

  Vehicle_Type : String,

  Vehicle_Id:{
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
    },

  Services: String,

  // Subserivces: :[{
  //         type: Schema.Types.ObjectId,
  //         ref: 'Subservice',
  //     }],

  card_details : Array,

  Subserivces: String,

  Pickup_Date: String,

  Pickup_Time: String,

  Delivery_Time: String,

  Delivery_Date:Date,

  Mechanic_Name : String,

  Mechanic_id: String,

  Mechanic_Phone: Number,

  Vehicle_Image: String,

  Vehicle_No: String,

  Arrival_Mode: String,

  Lubricant_type:String,

  Transaction_id: String,

  Vehiclepickup_Status: String,

  Vehicledelivery_Status :String,

  Vehicleservice_Status :String,

  Vechicle_Pickup_Images: String,

  Vehicle_Garage_Images: String,

  OTP: String,

  Unique_Code: String,

  Token_Status: String,

  Token_Age : String,

  Booking_Status: String,

  Current_Booking_Status: String,

  TAT: String,

  Final_bill_payed: String,

  Pick_Up_Location: Array,

  Pick_Up_City: String,

  //Booking_Date: Date,

  Vendor_Invoice: String,

  Job_Card: Array,

  Customer_Invoice: Array,

  Order_Value: Number,

  Workshop_Location: Array,

  Vendor_Id: {
        type: Schema.Types.ObjectId,
        ref: 'Mechanic'
    },
 Customer_Location: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
Workshop_Name: String,

Coupon_Code: String,

Coupon_Code_Percentage:String,

Coupon_Code_Amount: String,

Total_Amount:Number,

Booking_Time: String,

Year_Of_Mfg: String,

Vehicle_Name: String,

Customer_Invoice : Array,

Track_order_text : String,

Lubricant_type_color : String,


Status_history_text : Array,

Track_order_text : String,


Mechanicworkshop_ids : String,


User_issues : String,

Booking_at : String,





});
ServicebookingSchema.plugin(timestamps);
mongoose.model('Servicebooking', ServicebookingSchema);

module.exports = mongoose.model('Servicebooking');