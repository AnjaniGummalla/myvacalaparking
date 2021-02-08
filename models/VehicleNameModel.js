var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var VehicleNameSchema = new mongoose.Schema({   
  
  Vehicle_Brand_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vehiclebrandtype'
    },

  Vehicle_Image:String,

  Vehicle_Name: String,
  
  Fuel_Type: [{
          type: Schema.Types.ObjectId,
          ref: 'Fuel_Type'
      }],

  Vehicle_Model: [{
          type: Schema.Types.ObjectId,
          ref: 'VehicleMode'
      }],

  Vehicle_Type: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicletype'
    },

  Popular_Vehicle: Boolean,

  Vehicle_CC: String,

  mfg_year_start : Number,

  mfg_year_end : Number,
});

VehicleNameSchema.plugin(timestamps);

mongoose.model('VehicleName', VehicleNameSchema);

module.exports = mongoose.model('VehicleName');