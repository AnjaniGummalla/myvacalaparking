var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var parkingdetailsSchema = new mongoose.Schema({  

  parking_owner_id: {
        type: Schema.Types.ObjectId,
        ref: 'parkingowner'
  },
  parking_details_name:  String,
  parking_vendor_id : String,
  parking_details_address : String,
  parking_details_gstaddress : String,
  parking_details_gstdoc : String,
  parking_details_gstno : String,
  parking_details_maplink : String,
  parking_details_lat : Number,
  parking_details_long : Number,
  parking_details_pocemail : String,
  parking_details_slots_Bike_details : Array,
  parking_details_slots_Car_details :  Array,

  parking_details_slots_count_Bike : Number,
  parking_details_slots_count_Car :  Number,

  parking_prices:Number,
  // parking_distance:Number,
  // parking_reach_time:Number,


    // parking_prices:String,
  parking_distance:String,
  parking_reach_time:String,
  
  parking_details_price_bike_type : Boolean,
  parking_details_price_car_type :  Boolean,
  parking_details_price_both_type :  Boolean,
  parking_details_bike_price_day : Array,
  parking_details_bike_price_spe_day : Array,
  parking_details_car_price_day : Array,
  parking_details_car_price_spe_day : Array,


  parking_details_update_status : String,
});

parkingdetailsSchema.plugin(timestamps);

mongoose.model('parkingdetails', parkingdetailsSchema);

module.exports = mongoose.model('parkingdetails');
