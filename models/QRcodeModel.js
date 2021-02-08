var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var QRcodeSchema = new mongoose.Schema({   
  
  Vendor_id : String,

  Vendor_Name : String,

  Parking_Area_Name : String,


    Vehicletype_id : {
        type: Schema.Types.ObjectId,
        ref: 'Vehicletype',
    },
    

  Lat : String,

  Long: String,

  Entry: String,

  Block_Name: String,

  QRcode_Image_URL: String

});
QRcodeSchema.plugin(timestamps);

mongoose.model('QRcode', QRcodeSchema);

module.exports = mongoose.model('QRcode');