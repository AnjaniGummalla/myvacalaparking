var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');
var DriverSchema = new mongoose.Schema({   
  
	  Name: String,
	  Gender:String,
	  Email: String,
	  Password: String,
	  DOB: Date,
	  Primary_Contact : Number,
	  Secondary_Contact : Number,
	  Residence_Address : String,
	  Permanent_Address : String,
	  Address_Proof : String,
	  Adhaar_Card : String,
	  Voter_ID : String,
	  Original_Driving_License : String,
	  DL_No : String,
	  Valid_Upto : String,
	  Nominee_Name : String,
	  Nominee_Address : String,
	  Nominee_Contact : String,
	  Reference_Name : String,
	  Reference_Address : String,
	  Reference_Contact: String,
	  Education_Qualification: String,
	  Batch_Enrolled:String,
	  Date_of_Batch_Enrolled: String,
	  Any_Accident_Case_Ongoing: String,
	  Total_Driving_Experience: String,
	  Manual:String,
	  Auto_Transmission: String,
	  Both:String,
	  Luxury_Cars: String,
	  Full_Time:String,
	  Part_Time:String,
	  Android_Phone:String,
	  Outstaion_Travel: String

});
DriverSchema.plugin(timestamps);
mongoose.model('Driver', DriverSchema);

module.exports = mongoose.model('Driver');