var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var SubscriptionSchema = new mongoose.Schema({   
  
  Title: String,

  Desciption:String,

  Duration: String,
  
  Price:Number,

  Included: Array,

  Subscription_Image: String,

});

SubscriptionSchema.plugin(timestamps);

mongoose.model('Subscription', SubscriptionSchema);

module.exports = mongoose.model('Subscription');