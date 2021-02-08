var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var CartSchema = new mongoose.Schema({   
  
  Item_Details:  [{
          type: Schema.Types.ObjectId,
          ref: 'Subservice'
      }],

  Customer_id: {
          type: Schema.Types.ObjectId,
          ref: 'Customer'
      },
  
  Vehicle_type: String,

  Vehicle_details : Array,

  Date_And_Time: String,

  Make_payment:String,

  Item_Total:String,

  Coupon_Code: String,

  Coupon_percentage: String,

  Coupon_Amount: String,

  You_Pay:String,

  Address_Details:String

});


mongoose.model('Cart', CartSchema);

module.exports = mongoose.model('Cart');