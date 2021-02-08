var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const randomstring = require('random-string');
var VehicleModel = require('./../models/VehicleModel');
var CustomerModel = require('./../models/CustomerModel');
var Customer_LocationModel = require('./../models/Customer_LocationModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');
var CartModel = require('./../models/CartModel');

router.post('/mobile/create', [
    check('Customer_id').not().isEmpty().withMessage("Please select the Customer_id"),
    //check('Vehicle_Id').not().isEmpty().withMessage("Please provide valid Details"),
    check('Vehicle_No').not().isEmpty().withMessage("Please provide valid Vehicle_No"),
  ], async function(req, res) {
  try{
    const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
    console.log(req.body)
    var Defaultcheck = await VehicleModel.findOne({Customer_id:req.body.Customer_id,Vehicletype_Name:req.body.Vehicletype_Name});
   console.log(Defaultcheck);
   var Samevehicle = await VehicleModel.findOne({Customer_id:req.body.Customer_id,Vehicle_No:req.body.Vehicle_No});
    var statust = "";
    if(Defaultcheck == null)
     {
      statust = "Default";
     }
     if(Samevehicle == null){
        await VehicleModel.create({
             Customer_id : req.body.Customer_id || "",
             Vehicle_Image:req.body.Vehicle_Image || "",
             Vehicletype_id:req.body.Vehicletype_id  || "",
             Vehicletype_Name:req.body.Vehicletype_Name  || "",
             Vehicle_Brand_id : req.body.Vehicle_Brand_id  || "",
             Vehicle_Brand_Name : req.body.Vehicle_Brand_Name  || "",
             Vehicle_Name_id : req.body.Vehicle_Name_id  || "",
             Vehicle_Name : req.body.Vehicle_Name  || "",
             Year_of_Manufacture : req.body.Year_of_Manufacture || "",
             Vehicle_No : req.body.Vehicle_No  || "",
             Fuel_Type_id : req.body.Fuel_Type_id  || "",
             Fuel_Type_Name : req.body.Fuel_Type_Name  || "",
             Fuel_Type_Background_Color : req.body.Fuel_Type_Background_Color  || "",
             // Vehicle_Model_id : req.body.Vehicle_Model_id  || "",
             // Vehicle_Model_Name : req.body.Vehicle_Model_Name  || "",
             Status: statust
        }, 
        async function (err, user) {
          console.log(user);
           if(user!=null){
            var customerdatalocationstatus = await CustomerModel.findByIdAndUpdate({_id:req.body.Customer_id},{Vehicle_Type_Status: true},{new: true});
          }
        res.json({Status:"Success",Message:"Added successfully", Data :user ,Code:200}); 
    });
     }
     else{
       res.json({Status:"Failed",Message:"Vehicle Already Added", Data :{} ,Code:300}); 
     }
    //var vehiclecheck = await VehicleModel.find({Vehicle_No:req.body.Vehicle_No});
         
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.post('/status', function (req, res) {
        VehicleModel.findByIdAndUpdate(req.body.Vehicle_id,req.body, {new: true} ,function (err, Servicebookingdetails) {
          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});

router.get('/getlist',function (req, res) {
        VehicleModel.find({}, function (err, Vehicledetails) {
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        }).populate('Vehicletype_id Vehiclebrandtype_id');
});

router.post('/mobile/cvehiclelist',async function (req, res) {
        var type_check = await CartModel.findOne({Customer_id:req.body.Customer_id});
        console.log(type_check);
        var count = 1 ;
        var alert_msg = "Are you sure you want to change this vehicle as your default? This will remove the previously added items added to the cart. Are you sure you want to proceed?";
        if(type_check == null){
           count = 0
        }else{
        if(type_check.Item_Details.length == 0){
           count = 0
        }
        }        
        VehicleModel.find({Customer_id:req.body.Customer_id,Vehicletype_id:req.body.Vehicletype_id}, function (err, Vehicledetails) {
           if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data :[],Code:500});
           if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [], cart : count, alert_msg : alert_msg, Code:404});
           }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails , cart : count, alert_msg : alert_msg, Code:200});
        });
});

router.put('/mobile/edit',function (req, res) {
        VehicleModel.findByIdAndUpdate(req.body.Vehicle_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [],Code:404});
           }
             res.json({Status:"Success",Message:"Vehicledetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
router.post('/mobile/edit',function (req, res) {
        VehicleModel.findByIdAndUpdate(req.body.Vehicle_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [],Code:404});
           }
             res.json({Status:"Success",Message:"Vehicledetails Updated", Data : UpdatedDetails ,Code:200});
        });
});

// router.put('/mobile/statuschange',async function (req, res) {
// 	var vehicleoldstatus = await VehicleModel.findOne({Customer_id:req.body.Customer_id,Status:"Default"});
// 	var statuschange = await VehicleModel.findByIdAndUpdate({_id:vehicleoldstatus._id},{Status: ""},{new:true})
//       await  VehicleModel.findByIdAndUpdate({_id:req.body.Vehicle_id},{Status:"Default"} ,{new: true}, function (err, UpdatedDetails) {
//             if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//            if(UpdatedDetails == ""){
//             return res.json({Status:"Failed",Message:"No data Found", Data : [],Code:404});
//            }
//              res.json({Status:"Success",Message:"Vehicledetails Updated", Data : UpdatedDetails ,Code:200});
//         });
// });


router.put('/mobile/statuschange',async function (req, res) {
  console.log(req.body);
  var vehicleoldstatus = await VehicleModel.find({Customer_id:req.body.Customer_id,Vehicletype_id:req.body.Vehicletype_id,Status:"Default"});
  console.log("which id is status default" ,vehicleoldstatus);
  var statuschange = await VehicleModel.findByIdAndUpdate({_id:vehicleoldstatus[0]._id},{Status:""},{new:true});
  console.log("Updation done" ,statuschange);
  var finalupdate = await VehicleModel.findByIdAndUpdate({_id:req.body.vehicle_id},{Status:"Default"},{new:true});
  var deleted = await CartModel.remove({Customer_id:req.body.Customer_id});
  console.log(deleted);
  res.json({Status:"Success",Message:"Vehicledetails Updated", Data : finalupdate ,Code:200});
});


// // DELETES A USER FROM THE DATABASE
router.post('/mobile/delete',function (req, res) {
      VehicleModel.findByIdAndRemove(req.body.Vehicle_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [],Code:404});
           }
          res.json({Status:"Success",Message:"Vehicle Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes',function (req, res) {
      VehicleModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Vehicles Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;