var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var MobilesplashscreenModel = require('./../models/mobilesplashscreenModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');
var sha512 = require('js-sha512');




router.post('/create', async function(req, res) {
  try{
     await MobilesplashscreenModel.create({
          gif_path : req.body.gif_path,
          Back_end_details :  req.body.Back_end_details,
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Mobile Splash Git Added successfully", Data :user ,Code:200}); 
    });      
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.post('/getpayu', async function(req, res) {
  try{
    console.log(req.body);
     
      // Test Key
      var string = req.body.String + 'eCwWELxi';
     
     // Live Key    
     // var string = req.body.String + 'g0nGFe03';
    // console.log('gtKFFx|2010132012|1|iPhone11|sriram|sriramchanr@gmail.com|udf1|udf2|||||||||');
    console.log(string);
    var hash = sha512(string);
    res.json({Status:"Success",Message:"Mobile Splash Git Added successfully", Data :hash ,Code:200}); 
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});




router.get('/getlist', function (req, res) {
        MobilesplashscreenModel.find({}, function (err, FAQ) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(FAQ == ""){
            return res.json({Status:"Failed",Message:"No Data found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Mobile Splash Git Details", Data : FAQ ,Code:200});
        }).populate('Vehicle_Type_id');
});

router.get('/mobile/getlist', function (req, res) {
        MobilesplashscreenModel.find({}, function (err, FAQ) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(FAQ == ""){
            return res.json({Status:"Failed",Message:"No Data found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Mobile Splash Git Details", Data : FAQ ,Code:200});
        }).populate('Vehicle_Type_id');
});

router.put('/edit', function (req, res) {
        MobilesplashscreenModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Mobile Splash Git Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      MobilesplashscreenModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Mobile Splash Git Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      MobilesplashscreenModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Mobile Splash Git Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;