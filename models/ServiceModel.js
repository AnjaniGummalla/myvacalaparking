var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var ServiceSchema = new mongoose.Schema({   
  
  Service_Name: String,

  Service_Image: String,

  Master_Service_id: {
        type: Schema.Types.ObjectId,
        ref: 'MasterService'
    },
  
  Vehicle_Type_id:{
        type: Schema.Types.ObjectId,
        ref: 'Vehicletype'
    },

  Desc: String,

  Popular: Boolean

});

ServiceSchema.plugin(timestamps);

mongoose.model('Service', ServiceSchema);

module.exports = mongoose.model('Service');