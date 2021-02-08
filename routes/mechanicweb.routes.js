var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var MechanicModel = require('./../models/MechanicModel');
var DriverModel = require('./../models/DriverModel');
var RM = require('random-number');
const requestss = require("request");
var VerifyToken = require('./VerifyToken');
var MechanicbookingModel = require('./../models/MechanicbookingModel');
const { check, validationResult } = require('express-validator');

router.post('/login',[
   check('Primary_Contact').not().isEmpty().isLength({ min: 10}).isDecimal().withMessage("Please enter a valid Phone number"),
  ],async function(req, res) {
      try{
        const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
    console.log("request...",req.body);
    var options = {
      min:  1000,
      max: 10000,
      integer: true
    }
    var Datacheck = await MechanicModel.findOne({Primary_Contact:req.body.Primary_Contact});
    console.log(RM(options));
    var OTP = RM(options);
    if(Datacheck == null){
     res.json({Status:"Failed",Message:"Invalid User Account", Data : {},Code:300});
    }else
    {
      const filter = { Primary_Contact: req.body.Primary_Contact};
      const update = { OTP: OTP };
      let Data = await MechanicModel.findOneAndUpdate(filter, update, {new: true});
      var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.Primary_Contact;
        var message =
          "Hi, Your OTP is " + OTP + ". My Vacala OTP for login.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls ="http://www.smsintegra.com/" +"api/smsapi.aspx?uid=" + username + "&pwd=" +password + "&mobile=" + mobilno +
          "&msg=" +
          message +
          "&sid=" +
          dumbell +
          "&type=" +
          tye;
        console.log(baseurls);
        requestss(baseurls, { json: true }, (err, res, body) => {
          if (err) {
            return console.log(err);
          }
        });
      res.json({Status:"Success",Message:"Login Successful", Data : {OTP},Code:200});
    }  
 }
   catch(e){
        console.log(e)
       res.json({Status:"Failed",Message:"Internal server issue", Data :{},Code:500});
     }    
  });

router.post('/otpverify',[
   check('Primary_Contact').not().isEmpty().isLength({ min: 10}).isDecimal().withMessage("Please enter a valid Phone number"),
   check('OTP').not().isEmpty().withMessage("Please enter a valid Phone number")
  ],async function (req, res) {
  try{
      const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
       var Datacheck = await MechanicModel.findOne({Primary_Contact:req.body.Primary_Contact,OTP:req.body.OTP});
       if(Datacheck == null){
     res.json({Status:"Failed",Message:"Invalid OTP", Data :{},Code:300});
    }else
    {
      const jwtToken = process.env.JWT_SECRET;
      const token = jwt.sign({ user: req.body.Email }, jwtToken);
      console.log("USer Token", token);
      let responseData = {
                        token: token,
                        user: Datacheck
                    }
      res.json({Status:"Success",Message:"Login Successful", Data : responseData ,Code:200});
      }
  }
  catch(e){
     res.json({Status:"Failed",Message:"Internal Server Error", Data :{},Code:500});
  }
        });

router.post('/mechaniclist', async function (req, res) {
          var lat = req.body.lat;
          var long = req.body.long;
          await MechanicModel.find({
                loc: {
                       $geoNear: {
                        $maxDistance: 1000,
                        $geometry: {
                        type: "Point",
                        coordinates: [long, lat ]
                  }
              }
          }
         }).find((error, results) => {
          if (error) console.log("what is the error" ,error);
          console.log(JSON.stringify(results, 0, 2));
          if(results == ""){
            res.json({Status:"Failed",Message:"No data Found", Data :[] ,Code:404});
          }
           res.json({Status:"Success",Message:"Mechanicdetails around the customer location", Data :results ,Code:200});
         });
        });

router.post('/bookinglist',async function (req, res) {
        await MechanicbookingModel.find({Mechanic_Phone: req.body.Primary_Contact}, function (err, Servicebookingdetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Servicebookingdetails == "") return res.json({Status:"Failed",Message:"No data Found", Data : [] ,Code:404});
          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});

router.put('/status',async function (req, res) {
        const filter = { Booking_id: req.body.Booking_id};
        const update = { Booking_Status: req.body.Booking_Status};
       await MechanicbookingModel.findOneAndUpdate(filter, update, {new: true} ,function (err, Servicebookingdetails) {
        if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Servicebookingdetails == "") return res.json({Status:"Failed",Message:"No data Found", Data : [] ,Code:404});
          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});

router.put('/edit', function (req, res) {
        MechanicModel.findByIdAndUpdate(req.body.Mechanic_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == "") return res.json({Status:"Failed",Message:"No data Found", Data : [] ,Code:404});
             res.json({Status:"Success",Message:"Mechanicdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      MechanicModel.findByIdAndRemove(req.body.Mechanic_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(user == "") return res.json({Status:"Failed",Message:"No data Found", Data : [] ,Code:404});
          res.json({Status:"Success",Message:"Mechanic Deleted successfully", Data : {} ,Code:200});
      });
});
router.delete('/deletes', function (req, res) {
      MechanicModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Mechanic Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;