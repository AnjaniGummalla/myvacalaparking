var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var Fuel_TypeModel = require('./../models/FueltypeModel');
var PopularVehicleModel = require('./../models/PopularvehiclesModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{
     await Fuel_TypeModel.create({
          Fuel_Type : req.body.Fuel_Type,
          Background_Color:req.body.Background_Color,
          Background_Color_name:req.body.Background_Color_name,
        }, 
        function (err, user) {
          console.log(err)
          console.log(user);
        res.json({Status:"Success",Message:"Added successfully", Data :user ,Code:200}); 
    });      
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.get('/getlist', function (req, res) {
        Fuel_TypeModel.find({}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});
router.get('/mobile/getlist', function (req, res) {
        Fuel_TypeModel.find({}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});
router.post('/edit', function (req, res) {
        Fuel_TypeModel.findByIdAndUpdate(req.body.Fueltype_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Vehicledetails Updated", Data : UpdatedDetails ,Code:200});
        });
        });

router.post('/delete', function (req, res) {
      Fuel_TypeModel.findByIdAndRemove(req.body.Fuel_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Fuel type Deleted successfully", Data : {} ,Code:200});
      });
});

// router.post('/mobile/brandlist',async function (req, res) {
//        var vechilename = await VehcilenNameModel.find({});
//        var vechilebrandlist = await VehiclebrandtypeModel.find({Vehicle_Type_id:req.body.Vehicle_Type_id});
//        var Branddetails = [];
//        for(let a = 0 ; a < vechilebrandlist.length ; a ++){
//        	let d =
//        	{
// _id:vechilebrandlist[a]._id,
// Vehicle_Type_id: vechilebrandlist[a].Vehicle_Type_id,
// Vehicle_Brand_Image: vechilebrandlist[a].Vehicle_Brand_Image,
// Vehicle_Brand_Name: vechilebrandlist[a].Vehicle_Brand_Name,
// Vehicle_name_list: []
// }
//   Branddetails.push(d)
//   if(a ==  vechilebrandlist.length - 1){
//       for(let k = 0 ; k < Branddetails.length ; k ++){
//       	for(let j = 0 ; j < vechilename.length ; j ++){
//       		console.log(Branddetails[k]._id,vechilename[j].Vehicle_Brand_id);
//       		if(""+Branddetails[k]._id == ""+vechilename[j].Vehicle_Brand_id){
//             console.log("dfdfdfd",Branddetails[k]._id,vechilename[j].Vehicle_Brand_id)
//       			Branddetails[k].Vehicle_name_list.push(vechilename[j]);
//       		}
//       	}
//       	console.log(k,Branddetails.length - 1);
//           if(k == Branddetails.length - 1){
//           	 res.json({Status:"Success",Message:"Vehicledetails", Data : Branddetails ,Code:200});
//           }
//       }

//   }
//        }


//         // await VehiclebrandtypeModel.find({Vehicle_Type_id:req.body.Vehicle_Type_id}, function (err, Vehicledetails) {
//         //   if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//         //   if(Vehicledetails == ""){
//         //     return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
//         //   }
//         //   res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
//         // });
// });

// router.post('/vehiclewithbrand', function (req, res) {
//         VehiclebrandtypeModel.find({Vehicle_Brand:req.body.Vehicle_Brand,Vehicle_Type_id:req.body.Vehicle_Type_id}, function (err, Vehicledetails) {
//           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//           if(Vehicledetails == ""){
//             return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
//           }
//           res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
//         }).select('Vehicle_Name');
// });

// router.post('/addvehicle', function (req, res) {
//         VehiclebrandtypeModel.find({}, function (err, Vehicledetails) {
//           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//           if(Vehicledetails == ""){
//             return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
//           }
//           res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
//         });
// });
// router.get('/vehicletypegetlist', function (req, res) {
//         VehiclebrandtypeModel.find({Vehicle_Type:req.body.Vehicle_Type}, function (err, Vehicledetails) {
//           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//           if(Vehicledetails == ""){
//             return res.json({Status:"Failed",Message:"No vehicles found", Data :[],Code:404});
//           }
//           res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
//         });
// });
// router.get('/vehiclename', function (req, res) {
//         VehiclebrandtypeModel.find({Vehicle_Name:req.body.Vehicle_Name}, function (err, Vehicledetails) {
//           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//           if(Vehicledetails == ""){
//             return res.json({Status:"Failed",Message:"No vehicles found", Data : [],Code:404});
//           }
//           res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
//         });
// });
// router.put('/edit', function (req, res) {
//         VehiclebrandtypeModel.findByIdAndUpdate(req.body.Vehicletype_id, req.body, {new: true}, function (err, UpdatedDetails) {
//             if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//              res.json({Status:"Success",Message:"Vehicledetails Updated", Data : UpdatedDetails ,Code:200});
//         });
// });
// // // DELETES A USER FROM THE DATABASE
// router.post('/delete', function (req, res) {
//       VehiclebrandtypeModel.findByIdAndRemove(req.body._id, function (err, user) {
//           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//           res.json({Status:"Success",Message:"Vehicle Deleted successfully", Data : {} ,Code:200});
//       });
// });

// router.delete('/deletes', function (req, res) {
//       VehiclebrandtypeModel.deleteMany({}, function (err, user) {
//           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//           res.json({Status:"Success",Message:"Vehicles Deleted successfully", Data : {} ,Code:200});
//       });
// });
module.exports = router;