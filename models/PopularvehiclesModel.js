var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var PopularVehiclesSchema = new mongoose.Schema({   
  
Vehicle_Type_Name: String,
Vehicle_Type_id: String,
Vehicle_Brand_Name: String,
Vehicle_Brand_id: String,
Vehicle_Details: Array,
// vehicle_id: String,
// Vehicle_Image: String,
// Fuel_Type: Array,
// Fuel_Type_id: String,
// Vehicle_Model: Array,
// Vehicle_Model_id: String,

});

PopularVehiclesSchema.plugin(timestamps);

mongoose.model('PopularVehicles', PopularVehiclesSchema);

module.exports = mongoose.model('PopularVehicles');