var mongoose = require('mongoose');
const Schema = mongoose.Schema; 
var timestamps = require('mongoose-timestamp');

var CouponsSchema = new mongoose.Schema({  
  
  Coupon_Code: String,

  Expiry_Date: Date,

  Start_Date: Date,

  Customer_id: [{
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    }],

   Masterservice_id: {
        type: Schema.Types.ObjectId,
        ref: 'MasterService'
    },

     Vehicle_type_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicletype'
    },

     Mainservice_id: {
        type: Schema.Types.ObjectId,
        ref: 'Service'
    },

  Coupon_status : String,

  Value_Type: String,

  Amount : Number,

  Count: Number,

  Value: Number,

  Description: String,

  Coupon_For: String

});

CouponsSchema.plugin(timestamps);

mongoose.model('Coupon', CouponsSchema);

module.exports = mongoose.model('Coupon');