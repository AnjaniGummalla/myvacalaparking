var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');
const bcrypt = require('bcrypt');

var EmployeeSchema = new mongoose.Schema({   
  
  Alternate_Contact: String,

  Email_Id: String,

  EmployeeAadharCard_file: String,

  EmployeeAadharCard_no: String,

  EmployeePanCard_file: String,

  EmployeePanCard_no: String,

  Employee_Id: String,

  Employee_LastName:String,

  Employee_Name:Array,

    Location: [{
          type: Schema.Types.ObjectId,
          ref: 'Location'
      }],


  Nomaniee_Name:String,

  NomineeAadharCard_file: String,

  NomineeAadharCard_no: String,

  NomineeAddress:String,

  NomineeMobileNumber:String,

  NomineePanCard_file: String,

  NomineePanCard_no: String,

  Permanentaddress: String,

  Permissions : Array,

  Primary_Contact:String,

  Role_Name: String,

  Sector: Array,

  Temporaryaddress:String,

  OTP: String,

  created_by : String,

  employee_status : String,


  password : String,

});

EmployeeSchema.plugin(timestamps);
mongoose.model('Employee', EmployeeSchema);

module.exports = mongoose.model('Employee');