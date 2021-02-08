var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');
var ProductEstimationSchema = new mongoose.Schema({   
  
  Mechanic_id: String,
  Mechanic_Name:String,
  Token_id: String,
  Booking_id:String,
  Product_Status: String,
  Product_Description: String,
  Quantity: Number,
  Part_Cost: Number,
  Labour_Cost : Number,
  Part_GST_Percent : Number,
  Part_Cost_Without_GST : Number,
  Part_Cost_With_GST: Number,
  Total_Amount : Number,
  Upload_Documents: String,
  Vehicle_Images:String,
  ODO_Reading: String,
  Estimation_Status:String,
  Estimation_Cost:Number

});
ProductEstimationSchema.plugin(timestamps);
mongoose.model('ProductEstimation', ProductEstimationSchema);

module.exports = mongoose.model('ProductEstimation');