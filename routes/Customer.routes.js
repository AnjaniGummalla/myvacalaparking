var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var CustomerModel = require('./../models/CustomerModel');
var ServiceModel = require('./../models/ServiceModel');
var VerifyToken = require('./VerifyToken');
var SubserviceModel = require('./../models/SubserviceModel');
var VehicleModel = require('./../models/VehicleModel');
var LocationModel = require('./../models/LocationModel');
var MasterServiceModel = require('./../models/MasterserviceModel');
var MechanicbookingModel = require('./../models/MechanicbookingModel');
var CurrentlocationModel = require('./../models/Customer_LocationModel');
var CustomeraltlocationModel = require('./../models/Customer_Alt_LocationModel');
var CustomerhomelocationModel = require('./../models/Home_LocationModel');
var VehicletypeModel = require('./../models/VehicletypeModel');
const randomstring = require('randomstring');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{
    var customercheck = await CustomerModel.findOne({Email:req.body.Email})
    if(customercheck!== null)
    {
      res.json({Status:"Failed",Message:"Email Id Already exists", Data : {} ,Code:300}); 
    }
    else
    {
     await CustomerModel.create({
           Name : req.body.Name,
           Gender : req.body.Gender,
           DOB : req.body.DOB,
           Email:req.body.Email,
           Type:req.body.Type,
           Password:req.body.Password,
           Address : req.body.Address,
           Phone : req.body.Phone,
           Profile_Pic : req.body.Profile_Pic,
           OTP:req.body.OTP || ""
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


// router.post('/bookamechanic', async function(req, res) {
//   try{
//      var Unique_Code = randomstring.generate(7);
//      await MechanicbookingModel.create({
//            Customer_Name : req.body.Customer_Name,
//            Customer_id:req.body.Customer_id,
//            Customer_Phone : req.body.Customer_Phone,
//            Customer_Address : req.body.Customer_Address,
//            Customer_Email : req.body.Customer_Email,
//            Services : req.body.Services,
//            Subserivces: req.body.Subserivces,
//            Pickup_Date : req.body.Pickup_Date,
//            Pickup_Time : req.body.Pickup_Time,
//            Delivery_Time : req.body.Delivery_Time,
//            Delivery_Date : req.body.Delivery_Date,
//            Vehicle_Type: req.body.Vehicle_Type,
//            Vehicle_No: req.body.Vehicle_No,
//            Lubricant_type:req.body.Lubricant_type,
//            Mechanic_Name:req.body.Mechanic_Name,
//            Mechanic_id:req.body.Mechanic_id,
//            Mechanic_Phone:req.body.Mechanic_Phone,
//            Pick_up:req.body.Pick_up,
//            Payment:req.body.Payment,
//            Token_Status:req.body.Token_Status,
//            Vehiclepickup_Status:req.body.Vehiclepickup_Status,
//            Vehicledelivery_Status:req.body.Vehicledelivery_Status,
//            Vehicleservice_Status: req.body.Vehicleservice_Status,
//            OTP:req.body.OTP || "",
//            Vechicle_Pickup_Images: req.body.Vechicle_Pickup_Images,
//            Vehicle_Garage_Images: req.body.Vehicle_Garage_Images,
//            Unique_Code:req.body.Unique_Code,
//         }, 
//         function (err, user) {
//           console.log(user)
//         res.json({Status:"Success",Message:"Added successfully", Data :user ,Code:200}); 
//     });      
// }
// catch(e){
//       res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
// }
// });

router.post('/altlocationcreate', async function(req, res) {
  try{
    lat = req.body.lat;
    long = req.body.long;
   var check =  await CustomeraltlocationModel.find({ Customer_alt_Location:{
            "type": "Point",
            "coordinates": [
               lat,long
            ]
        } } );
   console.log(check)
   if(check == ""){
     await CustomeraltlocationModel.create({
           City : req.body.City,
           Customer_id:req.body.Customer_id,
           State : req.body.State,
           Customer_alt_Location: { type: "Point", coordinates: [lat, long ] },
           Country : req.body.Country,
           Street : req.body.Street,
           NearBy_LandMark : req.body.NearBy_LandMark,
           Location_NickName: req.body.Location_NickName,
           Flat_No : req.body.Flat_No
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data :user ,Code:200}); 
    }); 
    }
    else{
      res.json({Status:"Failed",Message:"Location Already Added", Data :{} ,Code:300});
    }   
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.get('/admin/customerlocationlist',async function (req, res) {
  
        await CurrentlocationModel.find({}, function (err, locations) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Location details", Data : locations ,Code:200});
        });
});




router.post('/getuserstatus',  function (req, res) {
        CustomerModel.find({_id:req.body.customer_id}, function (err, Servicedetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"User details", Data : Servicedetails ,Code:200});
        });
});






router.get('/vehicletypelist', function (req, res) {
  
        VehicletypeModel.find({}, function (err, Vehicledetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});

router.get('/Mechanicbookinglist', function (req, res) {
        MechanicbookingModel.find({}, function (err, Servicebookingdetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});

router.get('/Masterservicelist', function (req, res) {
  
        MasterServiceModel.find({}, function (err, Servicedetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Servicedetails", Data : Servicedetails ,Code:200});
        });
});
router.get('/serviceslist', function (req, res) {
  
        ServiceModel.find({}, function (err, Servicedetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Servicedetails", Data : Servicedetails ,Code:200});
        });
});

router.post('/subservicelist',  function (req, res) {
  
        SubserviceModel.find({Service_id:req.body.Service_id}, function (err, Servicedetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Servicedetails with subservices", Data : Servicedetails ,Code:200});
        });
});

router.get('/getlist', function (req, res) {
  
        CustomerModel.find({}, function (err, Customerdetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Customerdetails", Data : Customerdetails ,Code:200});
        });
});

router.post('/vehiclelist',function (req, res) {
  
        VehicleModel.find({Customer_id:req.body.Customer_id}, function (err, Vehicledetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        CustomerModel.findByIdAndUpdate(req.body.Customer_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Customerdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
router.put('/ledit', function (req, res) {
        CurrentlocationModel.findByIdAndUpdate(req.body.Location_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Customerdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.put('/mobile/locationedit', function (req, res) {
  var lat = req.body.lat;
  var long = req.body.long;
   req.body.Customer_Location = 
    {
            "type": "Point",
            "coordinates": [
               lat,long
            ]
        }
        CurrentlocationModel.findByIdAndUpdate(req.body.Location_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails==""){
              return res.json({Status:"Failed",Message:"No data Found", Data : {} ,Code:404});
             }
             else{
              res.json({Status:"Success",Message:"Location Details Updated", Data : UpdatedDetails ,Code:200});
             }    
        });
});

router.put('/altlocationedit', function (req, res) {
  var lat = req.body.lat;
  var long = req.body.long;
   req.body.Customer_alt_Location = 
    {
            "type": "Point",
            "coordinates": [
               lat,long
            ]
        }
        CustomeraltlocationModel.findOneAndUpdate(req.body.Customer_id, req.body, {new: true}, function (err, UpdatedDetails) {
          console.log(err)
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Customerdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.put('/homelocationedit', function (req, res) {
  var lat = req.body.lat;
  var long = req.body.long;
   req.body.Customer_Home_Location = 
    {
            "type": "Point",
            "coordinates": [
               lat,long
            ]
        }
        CustomerhomelocationModel.findOneAndUpdate(req.body.Customer_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Customerdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.put('/mobile/statuschange',async function (req, res) {
  var locationoldstatus = await CurrentlocationModel.find({Customer_id:req.body.Customer_id,Status:"Default"});
  console.log("which id is status default" ,locationoldstatus);
  var statuschange = await CurrentlocationModel.findByIdAndUpdate({_id:locationoldstatus[0]._id},{Status:""},{new:true});
  console.log("Updation done" ,statuschange);
  var finalupdate = await CurrentlocationModel.findByIdAndUpdate({ _id:req.body.Location_id},{Status:"Default"},{new:true});
  res.json({Status:"Success",Message:"Location Updated", Data : finalupdate ,Code:200});
  
});


router.post('/mobile/locationlist', async function (req, res) {
  // var customeraltlocation = await CustomeraltlocationModel.find({Customer_id:req.body.Customer_id});
  // var customerhomelocation = await CustomerhomelocationModel.findOne({Customer_id:req.body.Customer_id});
  var customercurrentlocation = await CurrentlocationModel.find({Customer_id:req.body.Customer_id});
  // customeraltlocation.push(customerhomelocation,customercurrentlocation);
   res.json({Status:"Success",Message:"Customer Location Details", Data :customercurrentlocation ,Code:200});
});

// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      CustomerModel.findByIdAndRemove(req.body.user_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Customer Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/mobile/delete', function (req, res) {
      CurrentlocationModel.findByIdAndRemove(req.body.Location_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Location Deleted successfully", Data : {} ,Code:200});
      });
});


// router.post('/delete', function (req, res) {
//       CustomerModel.findByIdAndRemove(req.body.user_id, function (err, user) {
//           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//           res.json({Status:"Success",Message:"Location Deleted successfully", Data : {} ,Code:200});
//       });
// });


router.delete('/deletes', function (req, res) {
      CustomerModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Vehicles Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;