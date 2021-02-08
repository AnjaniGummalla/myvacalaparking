var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
var CustomerSchema = new mongoose.Schema({   
  
  Name: String,

  Customer_Location: {
        type: Schema.Types.ObjectId,
        ref: 'Customerlocation'
    },
    Customer_alt_Location: {
        type: Schema.Types.ObjectId,
        ref: 'Customeraltlocation'
    },
     Customer_Home_Location: {
        type: Schema.Types.ObjectId,
        ref: 'CustomerHomelocation'
    },
    Vehicle_Type_Status: Boolean,

    Current_Location_Status: Boolean,
  //Current_Location: Array,

  //Alternate_Location: Array,

  User_Status:Boolean,

  Gender:String,

  Vehicle_Type: String,

  Email: String,

  Password: String,

  DOB: String,
  
  Address: String,

  Type: Number,

  Phone: Number,

  Profile_Pic: String,

  Services: String,

  //Subservice: Array,

  Pickup_required: String,

  Service_Date: String,

  Service_Time: String,

  Payment : String,

  OTP: String,

});

CustomerSchema.plugin(timestamps);

mongoose.model('Customer', CustomerSchema);

module.exports = mongoose.model('Customer');