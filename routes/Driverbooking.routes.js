var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var DriverBookingModel = require('./../models/DriverBookingModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{
     await DriverBookingModel.create({
           Customer_Name : req.body.Customer_Name,
           Customer_id:req.body.Customer_id,
           Customer_Phone : req.body.Customer_Phone,
           Customer_Address : req.body.Customer_Address,
           Customer_Email : req.body.Customer_Email,
           Driver_Name : req.body.Driver_Name,
           Driver_id: req.body.Driver_id,
           Driver_Phone : req.body.Driver_Phone,
           Driver_Address : req.body.Driver_Address,
           Driver_Email : req.body.Driver_Email,
           Vehicle_Type : req.body.Vehicle_Type,
           Pick_up_Location: req.body.Pick_up_Location,
           Vehicle_Model: req.body.Vehicle_Model,
           Pick_up_Date:req.body.Pick_up_Date,
           Pick_up_Time:req.body.Pick_up_Time,
           Round_trip:req.body.Round_trip,
           One_Trip:req.body.One_Trip,
           Vehicle_Image: req.body.Vehicle_Image,
           Booking_Status: req.body.Booking_Status,
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data :user ,Code:200}); 
    });      
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/getlist',  function (req, res) {
  
        DriverBookingModel.find({}, function (err, Driverbookingdetails) {
          res.json({Status:"Success",Message:"Driverbookingdetails", Data : Driverbookingdetails ,Code:200});
        });
});

router.post('/status', function (req, res) {
        DriverBookingModel.findByIdAndUpdate(req.body.Driverbooking_id,req.body, {new: true} ,function (err, Servicebookingdetails) {
          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});

router.post('/individuallist',  function (req, res) {
  
        DriverBookingModel.find({Customer_id:req.body.Customer_id}, function (err, Driverbookingdetails) {
          res.json({Status:"Success",Message:"Driverbookingdetails", Data : Driverbookingdetails ,Code:200});
        });
});
router.post('/driverbookinglist', function (req, res) {
        DriverBookingModel.find({Driver_id:req.body.Driver_id} ,function (err, Driverbookingdetails) {
          res.json({Status:"Success",Message:"Driverbookingdetails", Data : Driverbookingdetails ,Code:200});
        });
});

router.put('/edit', function (req, res) {
        DriverBookingModel.findByIdAndUpdate(req.body.Driverbooking_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Driverbookingdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete',  function (req, res) {
      DriverBookingModel.findByIdAndRemove(req.body.Driverbooking_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Driverbooking Deleted successfully", Data : {} ,Code:200});
      });
});
router.delete('/deletes', function (req, res) {
      DriverBookingModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Driverbookings Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;