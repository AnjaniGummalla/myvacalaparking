var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var NotificationSchema = new mongoose.Schema({   
  
  Title:String,

  Message: String,
  
  Message_Status:String,

  Date_Time: String,

  Booking_id: String,

  Customer_id:String

});

NotificationSchema.plugin(timestamps);

mongoose.model('Notification', NotificationSchema);

module.exports = mongoose.model('Notification');