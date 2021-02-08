var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var ServiceModel = require('./../models/ServiceModel');
var ServicebannerModel = require('./../models/ServicesBannerModel');
var Customer_LocationModel = require('./../models/Customer_LocationModel');
var VehicleModel = require('./../models/VehicleModel');
var HomebannerModel = require('./../models/HomebannerModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');
var CartModel = require('./../models/CartModel');

router.post('/create',[
    check('Service_Name').not().isEmpty().withMessage("Not a valid Name"),
    check('Master_Service_id').not().isEmpty().withMessage("Please provide valid Details"),
    check('Vehicle_Type_id').not().isEmpty().withMessage("Please provide valid Vehicle_Type_id"),
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
     await ServiceModel.create({
         Service_Name : req.body.Service_Name || "",
         Service_Image : req.body.Service_Image || "",
         Desc : req.body.Desc || "",
         Popular:req.body.Popular,
         Vehicle_Type_id: req.body.Vehicle_Type_id,
        Master_Service_id:req.body.Master_Service_id,
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

router.post('/mobile/mainservicegetlist', async function (req, res) {
var type_check = await CartModel.findOne({Customer_id:req.body.Customer_id});
        console.log(type_check);
        var count = 1 ;
        var alert_msg = "Are you sure you want to change the vehicle type?Looks like you have added some data to the cart.This will remove the previously added items added to the cart. Are you sure you want to proceed?";
        if(type_check == null){
           count = 0
        }
        else{
        if(type_check.Item_Details.length == 0){
           count = 0
        }
        }  
        await ServiceModel.find({Vehicle_Type_id:req.body.Vehicle_Type_id,Master_Service_id:req.body.Master_Service_id}, async function (err, Servicedetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           var locationData = await Customer_LocationModel.findOne({Customer_id:req.body.Customer_id,Status:"Default"});
           var CustomerVehicleData = await VehicleModel.find({Customer_id:req.body.Customer_id,Status:"Default"});
           var popularservice = await ServiceModel.find({Popular:true});
           var Servicebanner = await ServicebannerModel.find({Master_Service_id:req.body.Master_Service_id});
            if(Servicedetails == ""){
            let responseData = {
            mainserviceslist:Servicedetails,
            Bannerlist: Servicebanner,
            popularservice : popularservice,
            CustomerVehicleData : CustomerVehicleData,
            locationData:locationData,
            popularservice : popularservice
           }
            return res.json({Status:"Failed",Message:"No data Found", Data : responseData ,cart : count,alert_msg : alert_msg,Code:404});
           }
           let responseData = {
            mainserviceslist:Servicedetails,
            Bannerlist:Servicebanner,
            popularservice : popularservice,
            CustomerVehicleData : CustomerVehicleData,
            locationData:locationData,
            popularservice : popularservice
           }
            // return res.json({Status:"Failed",Message:"No data Found", Data : responseData ,Code:404});
          res.json({Status:"Success",Message:"Servicedetails", Data : responseData ,cart : count,alert_msg : alert_msg,Code:200});
        }).populate('Vehicle_Type_id ');
});


router.get('/getlistfull', async function (req, res) {
        await ServiceModel.find({}, function (err, Servicedetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Servicedetails", Data : Servicedetails ,Code:200});
        }).populate('Vehicle_Type_id Master_Service_id ');
});




router.post('/get_user_default',async function (req, res) {
        var locationData = await Customer_LocationModel.findOne({Customer_id:req.body.Customer_id,Status:"Default"});
        var CustomerVehicleData = await VehicleModel.find({Customer_id:req.body.Customer_id,Status:"Default"});
         res.json({Status:"Success",Message:"Servicedetails", locationData : locationData, CustomerVehicleData : CustomerVehicleData ,Code:200});
});





router.post('/getlistwithtype', async function (req, res) {
        await ServiceModel.find({Vehicle_Type_id:req.body.Vehicle_Type_id}, function (err, Servicedetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Servicedetails", Data : Servicedetails ,Code:200});
        }).populate('Vehicle_Type_id');
});

router.get('/popularlist', async function (req, res) {
        await ServiceModel.find({Popular:true}, function (err, Servicedetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Servicedetails", Data : Servicedetails ,Code:200});
        }).populate('Vehicle_Type_id');
});

router.get('/locationlist', async function (req, res) {
        LocationModel.find({}, function (err, Locationdetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Locationdetails", Data : Locationdetails ,Code:200});
        });
});
router.put('/edit', async function (req, res) {
        await ServiceModel.findByIdAndUpdate(req.body.Service_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"Servicedetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', async function (req, res) {
      await ServiceModel.findByIdAndRemove(req.body.Service_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Service Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      ServiceModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Service Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;