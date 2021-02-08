var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var CommentSchema = new mongoose.Schema({   
  
  Customer_Name: String,

  Customer_Comment:String,

  Mechanic_Name: String,

  Customer_Comment: String,

  Vehicle_id: String,

});

CommentSchema.plugin(timestamps);

mongoose.model('Comment', CommentSchema);

module.exports = mongoose.model('Comment');