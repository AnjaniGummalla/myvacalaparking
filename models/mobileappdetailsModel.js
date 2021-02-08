var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema; 

var mobileappdetailsSchema = new mongoose.Schema({  

  mobileappdetails:  Array,

});


mobileappdetailsSchema.plugin(timestamps);
mongoose.model('mobileappdetails', mobileappdetailsSchema);

module.exports = mongoose.model('mobileappdetails');

