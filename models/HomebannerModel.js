var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var HomebannerSchema = new mongoose.Schema({   
  
  Homebanner_Image: String,

  Title: String,

  Desc: String,

  Status: String,

  Date:String,

  Time:String

});
HomebannerSchema.plugin(timestamps);
mongoose.model('Homebanner', HomebannerSchema);

module.exports = mongoose.model('Homebanner');