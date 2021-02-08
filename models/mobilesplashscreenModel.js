var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema; 

var MobilesplashscreenSchema = new mongoose.Schema({  

  gif_path:  String,

});


MobilesplashscreenSchema.plugin(timestamps);
mongoose.model('mobilesplashscreen', MobilesplashscreenSchema);

module.exports = mongoose.model('mobilesplashscreen');

