var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var SubserviceModel = require('./../models/SubserviceModel');
var VehicleModel = require('./../models/VehicleModel');
var CartModel = require('./../models/CartModel');
var CustomerModel = require('./../models/CustomerModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');
var Customer_LocationModel = require('./../models/Customer_LocationModel');
var VehicleModel = require('./../models/VehicleModel');

router.post('/create',[
    check('Vehicle_Name_id').not().isEmpty().withMessage("Not a valid Vehicle_Name_id"),
    check('Service_id').not().isEmpty().withMessage("Please provide valid Details"),
    check('ItemList').not().isEmpty().withMessage("Please provide valid ItemList"),
  ], async function(req, res) {
  try{
    const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    } 
     await SubserviceModel.create({
         //  Title : req.body.Title,
         //  SubTitle:req.body.SubTitle,
         //  Service_id: req.body.Service_id,
         // // Vehiclename:req.body.Vehiclename,
         //  Service_Name: req.body.Service_Name,
         //  Service_Image: req.body.Service_Image,
         //  Thumb_Line_Image:req.body.Thumb_Line_Image,
         //  ItemList: req.body.ItemList,
         //  Original_Price: req.body.Original_Price,
         //  Discount_Price:req.body.Discount_Price

  Service_id:req.body.Service_id,
  
  sub_ser_Title: req.body.sub_ser_Title,

  sub_ser_image: req.body.sub_ser_image,

  sub_ser_Spec1: req.body.sub_ser_Spec1,

  Original_Price: req.body.Original_Price,

  Discount_Price: req.body.Discount_Price,
  
  Count_type : req.body.Count_type,

  sub_ser_display_img: req.body.sub_ser_display_img,

  ItemList: req.body.ItemList,

  Vehicle_Name_id:req.body.Vehicle_Name_id,

  Cart_Status: false,

  Cart_count: 0

  //Vehicle_manufacturer : req.body.Vehicle_manufacturer || "",

  //Vehicle_Model : req.body.Vehicle_Model || "",
  
  //Vehicle_fuel_type : req.body.Vehicle_fuel_type || "",

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

router.get('/getlist', async function (req, res) {
       await SubserviceModel.find({}, function (err, Subservicedetails) {
         if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Subservicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [],Code:404});
           }
          res.json({Status:"Success",Message:"Subservicedetails", Data : Subservicedetails ,Code:200});
        }).populate('Vehicle_Name_id Service_id');
});



router.post('/mobile/subservicelist', async function (req, res) {
  var CustomervehicleDetails = await VehicleModel.findOne({Customer_id:req.body.Customer_id, Vehicletype_id: req.body.Vehicletype_id, Status: 'Default'});
  console.log("vehicledetails",CustomervehicleDetails)
                     var locationData = await Customer_LocationModel.findOne({Customer_id:req.body.Customer_id,Status:"Default"});
                   var CustomerVehicleData = await VehicleModel.find({Customer_id:req.body.Customer_id,Status:"Default"});
       await SubserviceModel.find({Service_id:req.body.Service_id,Vehicle_Name_id:CustomervehicleDetails.Vehicle_Name_id}, async function (err, Servicedetails) {
        if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [] ,CustomerVehicleData : CustomerVehicleData,locationData:locationData,Code:404});
           }
            var CartDetails = await CartModel.findOne({Customer_id:req.body.Customer_id});
            console.log("servicerelated" , Servicedetails);
            if(CartDetails == null){
               res.json({Status:"Success",Message:"Servicedetails with subservices", Data : Servicedetails ,CustomerVehicleData : CustomerVehicleData,locationData:locationData,Code:200});
            }else{
               for(let a  =  0 ; a < Servicedetails.length ; a ++) {
                for(let b = 0 ; b < CartDetails.Item_Details.length; b ++){
                    var finale_response = [];
                     console.log(CartDetails.Item_Details[b],Servicedetails[a]._id);
                    if(""+CartDetails.Item_Details[b] == ""+Servicedetails[a]._id){
                      Servicedetails[a].Cart_count = Servicedetails[a].Cart_count + 1;
                    }
                }
                if(a == Servicedetails.length - 1){
                  res.json({Status:"Success",Message:"Servicedetails with subservices", Data : Servicedetails, CustomerVehicleData : CustomerVehicleData,locationData:locationData, Code:200});
                }
            }
            }
           
        }).populate('Vehicle_Name_id');
});

router.post('/mobile/status', async function (req, res) {
  
        await SubserviceModel.findByIdAndUpdate(req.body.Subservice_id,req.body, {new: true} ,function (err, Servicebookingdetails) {
         
          if(err)return res.json({Status:"Failed",Message:"No data Found", Data : [] ,Code:404});

          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});

router.post('/subservicelist', async function (req, res) {
       await SubserviceModel.find({_id:req.body.Subservice_id}, function (err, Servicedetails) {
        if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [] ,Code:404});
           }
          res.json({Status:"Success",Message:"Servicedetails with subservices", Data : Servicedetails ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        SubserviceModel.findByIdAndUpdate(req.body.Subservice_id, req.body, {new: true}, function (err, UpdatedDetails) {
        if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [] ,Code:404});
           }
             res.json({Status:"Success",Message:"Subservicedetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      SubserviceModel.findByIdAndRemove(req.body.Subservice_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [] ,Code:404});
           }
          res.json({Status:"Success",Message:"Subservice Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      SubserviceModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Subservice Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;