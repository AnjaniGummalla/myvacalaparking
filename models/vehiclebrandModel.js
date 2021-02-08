var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var VehiclebrandtypeSchema = new mongoose.Schema({   
  
  Vehicle_Type_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicletype'
    },

  //Vehicle_Brand_Image:String,

  Vehicle_Brand_Name: String,

});

VehiclebrandtypeSchema.plugin(timestamps);

mongoose.model('Vehiclebrandtype', VehiclebrandtypeSchema);

module.exports = mongoose.model('Vehiclebrandtype');