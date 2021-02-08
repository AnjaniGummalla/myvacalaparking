var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var PickupboyModel = require('./../models/PickupboyModel');
var VerifyToken = require('./VerifyToken');
const { body, check, validationResult } = require('express-validator');

router.post('/create',[
    check('Pickupboy_Name').not().isEmpty().isAlpha().withMessage("Not a valid Name"),
    check('Phone').not().isEmpty().isLength({ min: 10 }).isDecimal().withMessage("Not a valid Phone number"),
    check('DL_Number').not().isEmpty().withMessage("DL number should not be empty"),
  ],async function(req, res) {
    try{
      const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
    else{
      var phonecheck = await PickupboyModel.findOne({Phone:req.body.Phone});
      if(phonecheck!= null){
        res.json({Status:"Failed",Message:"Number already exists", Data :[] ,Code:403}); 
      }
      else{
         await PickupboyModel.create({
          Pickupboy_Name : req.body.Pickupboy_Name,
          Phone : req.body.Phone,
          DL_Number: req.body.DL_Number,
          Vendor_Id:req.body.Vendor_Id,
          Status:"active",
          Image:req.body.Image
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data :user ,Code:200}); 
    });      
}
      }
    
} 
catch(e){
      console.log(e)
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.post('/getlist', async function (req, res) {
        await PickupboyModel.find({Vendor_Id:req.body.Vendor_Id}, function (err, Pickupboydetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Pickupboydetails==""){
            res.json({Status:"Failed",Message:"No data Found", Data :[],Code:404});
          }
          else{
            res.json({Status:"Success",Message:"Pickupboydetails", Data : Pickupboydetails ,Code:200});
          }
        });
});

router.post('/mobilelist', function (req, res) {
        PickupboyModel.find({Phone:req.body.Phone}, function (err, Pickupboydetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           else if(Pickupboydetails == ""){
            res.json({Status:"Failed",Message:"No data Found", Data :[],Code:404});
          }
          res.json({Status:"Success",Message:"Pickupboydetails", Data : Pickupboydetails ,Code:200});
        });
});

router.put('/statuschange', function (req, res) {
        PickupboyModel.findByIdAndUpdate(req.body.Pickupboy_id,req.body, {new: true}, function (err, Pickupboydetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           else if(Pickupboydetails == ""){
            res.json({Status:"Failed",Message:"No data Found", Data :[],Code:404});
          }
          res.json({Status:"Success",Message:"Pickupboydetails", Data : Pickupboydetails ,Code:200});
        });
});
router.post('/activelist', function (req, res) {
        PickupboyModel.find({Status:req.body.Status}, function (err, Pickupboydetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           else if(Pickupboydetails == ""){
            res.json({Status:"Failed",Message:"No data Found", Data :[],Code:404});
          }
          res.json({Status:"Success",Message:"Pickupboydetails", Data : Pickupboydetails ,Code:200});
        });
});
router.put('/editdetails', function (req, res) {
        PickupboyModel.findByIdAndUpdate(req.body.Pickupboy_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             else if(UpdatedDetails == ""){
            res.json({Status:"Failed",Message:"No data Found", Data :[],Code:404});
          }
             res.json({Status:"Success",Message:"Pickupboydetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.delete('/delete', function (req, res) {
      PickupboyModel.findByIdAndRemove(req.body.Pickupboy_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           else if(user == ""){
            res.json({Status:"Failed",Message:"No data Found", Data :[],Code:404});
          }
          res.json({Status:"Success",Message:"Pickupboy Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      PickupboyModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Pickupboys Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;