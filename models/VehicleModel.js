var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var VehicleSchema = new mongoose.Schema({   
  
  Customer_id: String,

  Vehicle_Image:String,

  Vehicletype_id: String,

  Vehicletype_Name: String,

  Vehicle_Brand_id : String,

  Vehicle_Brand_Name: String,

  Vehicle_Name_id:String,

  Vehicle_Name: String,

 Year_of_Manufacture:String,

  Vehicle_No: String,

  Fuel_Type_id: String,

  Fuel_Type_Name: String,

  Vehicle_Model_id :String,

  Vehicle_Model_Name: String,

  Fuel_Type_Background_Color: String,

  Status:String
    
});
VehicleSchema.plugin(timestamps);

mongoose.model('Vehicle', VehicleSchema);

module.exports = mongoose.model('Vehicle');