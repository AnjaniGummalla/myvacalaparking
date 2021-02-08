var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var MechanicModel = require('./../models/MechanicModel');
var DriverModel = require('./../models/DriverModel');
var RM = require('random-number');
const randomstring = require('random-string');
const requestss = require("request");
var VerifyToken = require('./VerifyToken');
var MechanicbookingModel = require('./../models/MechanicbookingModel');
const { check, validationResult } = require('express-validator');

router.post('/create',[
    //check('Name').not().isEmpty().isAlpha().withMessage("Not a valid Name"),
    check('Primary_Contact').not().isEmpty().isLength({ min: 10 }).isDecimal().withMessage("Please upload a Image"),
    //check('DL_No').not().isEmpty().withMessage("Please provide valid Description"),
  ], async function(req, res) {
  try{
    var Mechanic_id = randomstring({
      length: 12,
      numeric: true,
      letters: true,
      special: false,
      exclude: ['a', 'b', 'c','d', 'e', 'f','g', 'h', 'i','j', 'k', 'l','m', 'n', 'o','p', 'q', 'r', 's' ,'t','w','x', 'y','z']
});
    var lat = req.body.lat;
    var long = req.body.long;
    var Mechanicexistance = await MechanicModel.findOne({Primary_Contact:req.body.Primary_Contact});
    var Driverexistance = await DriverModel.findOne({Primary_Contact:req.body.Primary_Contact});
    console.log(Mechanicexistance)
  if (Mechanicexistance!== null) {
    res.json({Status:"Failed",Message:"Phone number already registered", Data :{},Code:300});
  }
  else if(Driverexistance!== null){
     res.json({Status:"Failed",Message:"Phone number already registered", Data :{},Code:300});
  }
  else{
      await MechanicModel.create({
          First_Name: req.body.First_Name,
          Mechanic_id: Mechanic_id,
          Last_Name:req.body.Last_Name,
          Primary_Contact : req.body.Primary_Contact,
          Secondary_Contact : req.body.Secondary_Contact,
          Owner_Residence_Address: req.body.Owner_Residence_Address,
          Owner_Permanent_Address: req.body.Owner_Permanent_Address,
          Owner_Pan_Card_Number : req.body.Owner_Pan_Card_Number,
          Owner_Pan_Card_Document : req.body.Owner_Pan_Card_Document,
          Owner_Adhaar_Card_Number: req.body.Owner_Adhaar_Card_Number,
          Owner_Adhaar_Card_Document: req.body.Owner_Adhaar_Card_Document,
          loc_lat :  req.body.loc_lat,
          loc_long : req.body.loc_long,
          //workshop
          Work_Shop_Name : req.body.Work_Shop_Name,
          Work_Shop_Address : req.body.Work_Shop_Address,
          Workshop_Registration_Certificate : req.body.Workshop_Registration_Certificate,
          Workshop_Registration_Number: req.body.Workshop_Registration_Number,
          Workshop_GST_Number: req.body.Workshop_GST_Number,
          Workshop_GST_Certificate: req.body.Workshop_GST_Certificate,
          Work_Shop_Pan_Card_Number: req.body.Work_Shop_Pan_Card_Number,
          Workshop_Pan_Card_Document: req.body.Workshop_Pan_Card_Document,
          GST_Address: req.body.GST_Address,
          Map_Link:req.body.Map_Link,
          Workshop_service_Type:req.body.Workshop_service_Type,
          Workshop_Bike_Service_Advisor_Contact: req.body.Workshop_Bike_Service_Advisor_Contact || "",
          Workshop_Bike_Service_Advisor_Name: req.body.Workshop_Bike_Service_Advisor_Name  || "",
          Workshop_Car_Service_Advisor_Contact: req.body.Workshop_Car_Service_Advisor_Contact  || "",
          Workshop_Car_Service_Advisor_Name: req.body.Workshop_Car_Service_Advisor_Name  || "",
          // Scanning_device: req.body.Scanning_device,
          // Car_models_Known_to_service: req.body.Car_models_Known_to_service,
          // OTP:req.body.OTP || ""
        },
        function (err, user) {
          console.log(err)
          console.log(user)
          res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
  }        
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.post('/login',  async function(req, res) {
      try{
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
     res.json({Status:"Failed",Message:"Invalid User Account", Data : {},Code:401});
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

router.post('/otpverify', async function (req, res) {
  
       var Datacheck = await MechanicModel.findOne({Primary_Contact:req.body.Primary_Contact,OTP:req.body.OTP});
       if(Datacheck == null){
     res.json({Status:"Failed",Message:"Invalid OTP", Data :{},Code:300});
    }else
    {
      res.json({Status:"Success",Message:"Login Successful", Data : {Datacheck} ,Code:200});
      }
        });

router.post('/weekday', async function (req, res) {
  var datestring = req.body.requestedDate;
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var d =  new Date(datestring);
var dayName = days[d.getDay()];
console.log(dayName);
if(dayName == "Sunday" || dayName == "Saturday")
{
   res.json({Status:"Success",Message:"WeekEND", Data : dayName  ,Code:200});
}
else{
   res.json({Status:"Success",Message:"WeekDAY", Data : dayName  ,Code:200});
}
     
      });

router.get('/getlist', function (req, res) {
        MechanicModel.find({}, function (err, Mechanicdetails) {
          res.json({Status:"Success",Message:"Mechanicdetails", Data : Mechanicdetails ,Code:200});
        });
});


router.post('/getlist_by_id', function (req, res) {
        MechanicModel.find({Mechanic_id:req.body.Mechanic_id}, function (err, Mechanicdetails) {
          res.json({Status:"Success",Message:"Mechanicdetails", Data : Mechanicdetails ,Code:200});
        });
});


router.get('/bookinglist', function (req, res) {
        MechanicbookingModel.find({}, function (err, Servicebookingdetails) {
           Servicebookingdetails.sort(function compare(a, b) {
              console.log(a.server_date_time);
              console.log(b.server_date_time);
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               console.log(dateA,dateB);
               return dateB - dateA;
               });
          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});

router.post('/view', function (req, res) {
  
        MechanicModel.findById(req.body.Mechanic_id, function (err, Mechanicdetails) {
          res.json({Status:"Success",Message:"Mechanicdetails", Data : Mechanicdetails ,Code:200});
        });
});


router.post('/edit' ,function (req, res) {
        MechanicModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) returnres.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Mechanicdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      MechanicModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
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