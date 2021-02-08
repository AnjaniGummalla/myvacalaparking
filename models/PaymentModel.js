var mongoose = require('mongoose');
const Schema = mongoose.Schema; 
var timestamps = require('mongoose-timestamp');
var Payment_detailsSchema = new mongoose.Schema({  
  
  Mechanic_Name: String,

  Garage_Name: String,

  Customer_id: String,

  Payment_type: String,

  Payment_amount: String,

  Date_of_payment: String,

  Pay_by_email_id: String,

  Pay_by_name: String,

  Pay_by_Image: String,

  Booking_id: String,

  Vehicle_Number: String,

  Invoice:String,

  UTR: String,

  Invoice_Date: String,

  Payment_Status: String

});
Payment_detailsSchema.plugin(timestamps);
mongoose.model('Payment', Payment_detailsSchema);

module.exports = mongoose.model('Payment');