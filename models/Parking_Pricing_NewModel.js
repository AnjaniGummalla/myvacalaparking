var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var Parking_New_Pricing_Schema = new mongoose.Schema({   
  
 Parking_VendorDetails_Id: {
             type: Schema.Types.ObjectId,
             ref: 'parkingdetails'
    },

Pricing_Type: String,

  Parking_Day_Cost: Number,

  Parking_Monthly_Price: Number,

  Parking_Hours: Array,

  Vehicle_Type:[{
             type: Schema.Types.ObjectId,
             ref: 'Vehicletype'
    }],

  Time_Restriction: Boolean,

  Start_Date: {
      type: Date,
      Default: new Date()
    },
  End_Date:{
      type: Date,
      Default: new Date()
    },

});
Parking_New_Pricing_Schema.plugin(timestamps);

mongoose.model('Parking_New_Pricing', Parking_New_Pricing_Schema);

module.exports = mongoose.model('Parking_New_Pricing');