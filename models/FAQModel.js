var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var FAQSchema = new mongoose.Schema({   
  
  Question:String,

  Answer: String,

});

FAQSchema.plugin(timestamps);

mongoose.model('FAQ', FAQSchema);

module.exports = mongoose.model('FAQ');