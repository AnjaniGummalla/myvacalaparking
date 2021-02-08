var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var FinanceSchema = new mongoose.Schema({   
  
  Customer_Booking_id: String,

  Tax_Validation_Reports:String,

  Invoice_Status_Updation: String,
});
FinanceSchema.plugin(timestamps);
mongoose.model('Fianance', FinanceSchema);

module.exports = mongoose.model('Fianance');