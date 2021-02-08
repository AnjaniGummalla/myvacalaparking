var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var MechanicSchema = new mongoose.Schema({   
  Mechanic_id:String,
  First_Name: String,
  Last_Name:String,
  Primary_Contact: Number,
  Secondary_Contact: Number,
  loc_lat:  Number,
  loc_long:  Number,
  Owner_Residence_Address : String,
  Owner_Permanent_Address : String,
  Owner_Pan_Card_Number : String,
  Owner_Pan_Card_Document : String,
  Owner_Adhaar_Card_Number : String,
  Owner_Adhaar_Card_Document : String,
  Work_Shop_Name: String,
  Work_Shop_Address:String,
  Workshop_Registration_Certificate:String,
  Workshop_Registration_Number : String,
  Workshop_GST_Number : String,
  Workshop_GST_Certificate : String,
  Work_Shop_Pan_Card_Number : String,
  Workshop_Pan_Card_Document : String,
  GST_Address : String,
  Map_Link: String,
  Workshop_service_Type: String,
  Workshop_Bike_Service_Advisor_Contact: String,
  Workshop_Bike_Service_Advisor_Name: String,
  Workshop_Car_Service_Advisor_Contact: String,
  Workshop_Car_Service_Advisor_Name: String,
  // Tools_Available: Array,
  // Bike: String,
  // Scanning_device: String,
  // Car_models_Known_to_service: Array,
  // OTP: String,
  // Work_Shop_Address:String,
  // Workshop_Registration_Certificate :String,
  // Workshop_Registration_Number:String,
  // Workshop_GST_Number:String,
  // Workshop_GST_Certificate:String,
  // Work_Shop_Pan_Card_Number:String,
  // Workshop_Pan_Card_Document:String,
  // GST_Address:String,
  // Workshop_Service_Advisor_Contact:String,
  // Workshop_Service_Advisor_Name:String,


});

MechanicSchema.index({ "loc": "2dsphere" });

MechanicSchema.plugin(timestamps);
mongoose.model('Mechanic', MechanicSchema);

module.exports = mongoose.model('Mechanic');