var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var DriverModel = require('./../models/DriverModel');
var MechanicModel = require('./../models/MechanicModel');
var VerifyToken = require('./VerifyToken');
var DriverBookingModel = require('./../models/DriverBookingModel');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{
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
     await DriverModel.create({
          Name: req.body.Name,
          Gender:req.body.Gender,
          Email: req.body.Email,
          Password: req.body.Password,
          DOB: req.body.DOB,
          Primary_Contact : req.body.Primary_Contact,
          Secondary_Contact : req.body.Secondary_Contact,
          Residence_Address : req.body.Residence_Address,
          Permanent_Address : req.body.Permanent_Address,
          Address_Proof : req.body.Address_Proof,
          Adhaar_Card : req.body.Adhaar_Card,
          Voter_ID : req.body.Voter_ID,
          Original_Driving_License : req.body.Original_Driving_License,
          DL_No : req.body.DL_No,
          Valid_Upto : req.body.Valid_Upto,
          Nominee_Name : req.body.Nominee_Name,
          Nominee_Address : req.body.Nominee_Address,
          Nominee_Contact : req.body.Nominee_Contact,
          Reference_Name : req.body.Reference_Name,
          Reference_Address : req.body.Reference_Address,
          Reference_Contact: req.body.Reference_Contact,
          Education_Qualification: req.body.Education_Qualification,
          Batch_Enrolled: req.body.Batch_Enrolled,
          Date_of_Batch_Enrolled: req.body.Date_of_Batch_Enrolled,
          Any_Accident_Case_Ongoing: req.body.Any_Accident_Case_Ongoing,
          Total_Driving_Experience: req.body.Total_Driving_Experience,
          Auto_Transmission: req.body.Auto_Transmission,
          Both: req.body.Both,
          Luxury_Cars: req.body.Luxury_Cars,
          Full_Time: req.body.Full_Time,
          Part_Time: req.body.Part_Time,
          Android_Phone: req.body.Android_Phone,
          Outstaion_Travel: req.body.Outstaion_Travel,
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
    });
  }      
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/getlist', function (req, res) {
  
        DriverModel.find({}, function (err, Driverdetails) {
          res.json({Status:"Success",Message:"Driverdetails", Data : Driverdetails ,Code:200});
        });
});

router.get('/driverbookinglist', function (req, res) {
        DriverBookingModel.find({} ,function (err, Driverbookingdetails) {
          res.json({Status:"Success",Message:"Driverbookingdetails", Data : Driverbookingdetails ,Code:200});
        });
});

router.put('/edit', function (req, res) {
        DriverModel.findByIdAndUpdate(req.body.Driver_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) returnres.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Driverdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      DriverModel.findByIdAndRemove(req.body.Driver_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Driver Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      DriverModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Driver Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;