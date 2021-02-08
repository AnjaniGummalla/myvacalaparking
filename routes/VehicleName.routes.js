var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var VehicleNameModel = require('./../models/VehicleNameModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{
    var VehicleName = req.body.Vehicle_Name;
  var brandcheck = await VehicleNameModel.findOne({Vehicle_Name: { $regex: VehicleName,$options:'i'}});
  if(brandcheck!= null){
    res.json({Status:"Failed",Message:"Vehicle Already Exists", Data : {},Code:500});
  }
  else{
         await VehicleNameModel.create({
          Vehicle_Brand_id : req.body.Vehicle_Brand_id,
          Vehicle_Type:req.body.Vehicle_Type,
          Vehicle_Image:req.body.Vehicle_Image,
          Vehicle_Name : req.body.Vehicle_Name,
          Fuel_Type:req.body.Fuel_Type,
          Vehicle_Model:req.body.Vehicle_Model,
          Vehicle_CC:req.body.Vehicle_CC || "",
          Popular_Vehicle:req.body.Popular_Vehicle,
          mfg_year_start : req.body.mfg_year_start,
          mfg_year_end :req.body.mfg_year_end,
        }, 
        function (err, user) {
          console.log(err)
          console.log(user);
        res.json({Status:"Success",Message:"Added successfully", Data :user ,Code:200}); 
    });
  }
     
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.get('/getlist', function (req, res) {
        VehicleNameModel.find({}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        }).populate('Vehicle_Type Fuel_Type Vehicle_Model Vehicle_Brand_id');
});

router.get('/popular/getlist', function (req, res) {
        VehicleNameModel.find({Popular_Vehicle:true}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});

router.post('/mobile/fetchvehicledetails', function (req, res) {
        VehicleNameModel.find({_id:req.body.Vehicle_id}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        }).populate('Vehicle_Type Fuel_Type Vehicle_Model Vehicle_Brand_id');
});

router.post('/mobile/brandvehiclelist', function (req, res) {
        VehicleNameModel.find({Vehicle_Brand_id:req.body.Vehicle_Brand_id}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});

router.post('/vehiclewithbrand', function (req, res) {
        VehicleNameModel.find({Vehicle_Brand:req.body.Vehicle_Brand,Vehicle_Type_id:req.body.Vehicle_Type_id}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        }).select('Vehicle_Name');
});

router.post('/addvehicle', function (req, res) {
        VehicleNameModel.find({}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});
router.get('/vehicletypegetlist', function (req, res) {
        VehicleNameModel.find({Vehicle_Type:req.body.Vehicle_Type}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data :[],Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});
router.get('/vehiclename', function (req, res) {
        VehicleNameModel.find({Vehicle_Name:req.body.Vehicle_Name}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [],Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});
router.post('/edit', function (req, res) {
        VehicleNameModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
          console.log(err)
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Vehicledetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      VehicleNameModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Vehicle Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      VehicleNameModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Vehicles Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;