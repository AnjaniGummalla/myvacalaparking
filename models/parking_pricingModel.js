var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var Parking_PricingSchema = new mongoose.Schema({   
  
 parking_owner_id: {
        type: Schema.Types.ObjectId,
        ref: 'parkingowner'
  },
  
  Day: Array,

  Pricing_Type: String,

Cumulative1_hours:{
    type: Number,
    Default : 0
  },
  Cumulative1_price :{
  	type: Number,
  	Default : 0
  },
Cumulative2_hours:{
    type: Number,
    Default : 0
  },
  Cumulative2_price: {
  	type: Number,
  	Default : 0
  },
Cumulative3_hours:{
    type: Number,
    Default : 0
  },
  Cumulative3_price: {
  	type: Number,
  	Default : 0
  },

  Hourly_Price: {
  	type: Number,
  	Default : 0
  },
   Vehicle_Type: [{
           type: Schema.Types.ObjectId,
           ref: 'Vehicletype'
     }],
  Start_Date: {
      type: Date
    },
  End_Date:{
      type: Date
    },

});
Parking_PricingSchema.plugin(timestamps);

mongoose.model('Parking_Pricing', Parking_PricingSchema);

module.exports = mongoose.model('Parking_Pricing');