var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var VehicletypeModel = require('./../models/VehicletypeModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create', [
    check('Vehicle_Type').not().isEmpty().withMessage("Please give valid type"),
    //check('Vehicle_Name').not().isEmpty().withMessage("Please provide valid name"),
    //check('Vehicle_Brand').not().isEmpty().withMessage("Please provide valid brand"),
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
     }
     await VehicletypeModel.create({
          Vehicle_Type : req.body.Vehicle_Type,
          // Vehicle_Image : req.body.Vehicle_Image,
          // Vehicle_Name : req.body.Vehicle_Name,
          // Vehicle_Brand: req.body.Vehicle_Brand,
          // Vehicle_Fuel: req.body.Fuel
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

router.get('/mobile/getlist', function (req, res) {
        VehicletypeModel.find({}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        }).select('Vehicle_Type');
});

router.get('/getlist', function (req, res) {
        VehicletypeModel.find({}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        }).select('Vehicle_Type');
});

router.post('/addvehicle', function (req, res) {
        VehicletypeModel.find({}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});
router.get('/vehicletypegetlist', function (req, res) {
        VehicletypeModel.find({Vehicle_Type:req.body.Vehicle_Type}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data :[],Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});
router.get('/vehiclename', function (req, res) {
        VehicletypeModel.find({Vehicle_Name:req.body.Vehicle_Name}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [],Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});
router.put('/edit', function (req, res) {
        VehicletypeModel.findByIdAndUpdate(req.body.Vehicletype_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Vehicledetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      VehicletypeModel.findByIdAndRemove(req.body.Vehicletype_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Vehicle Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      VehicletypeModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Vehicles Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;