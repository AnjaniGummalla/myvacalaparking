var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var VehiclebrandtypeModel = require('./../models/vehiclebrandModel');
var VehicleNameModel = require('./../models/VehicleNameModel');
var VehcilenNameModel = require('./../models/VehicleNameModel');
var PopularVehicleModel = require('./../models/PopularvehiclesModel');
var VehicletypeModel = require('./../models/VehicletypeModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
    try{
  var brandname = req.body.Vehicle_Brand_Name;
  var brandcheck = await VehiclebrandtypeModel.findOne({Vehicle_Brand_Name: { $regex: brandname,$options:'i'}});
  console.log(brandcheck)
  if(brandcheck!= null){
    res.json({Status:"Failed",Message:"Brand Already Exists", Data : {},Code:500});
  }
  else{
    await VehiclebrandtypeModel.create({
          Vehicle_Type_id : req.body.Vehicle_Type_id,
          //Vehicle_Brand_Image : req.body.Vehicle_Brand_Image,
          Vehicle_Brand_Name : req.body.Vehicle_Brand_Name,
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

router.post('/popular/create', async function(req, res) {
  try{
     await PopularVehicleModel.create({
          Vehicle_Type_Name : req.body.Vehicle_Type_Name,
          Vehicle_Type_id : req.body.Vehicle_Type_id,
          Vehicle_Brand_Name : req.body.Vehicle_Brand_Name,
          Vehicle_Brand_id: req.body.Vehicle_Brand_id,
          Vehicle_Details : req.body.Vehicle_Details,
          //vehicle_id : req.body.vehicle_id,
          //Vehicle_Image : req.body.Vehicle_Image,
          //Vehicle_Model: req.body.Vehicle_Model,
          //Fuel_Type: req.body.Fuel_Type,
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

router.post('/popular/getlist', function (req, res) {
        PopularVehicleModel.find({Vehicle_Type_id:req.body.Vehicle_Type_id}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});

router.post('/mobile/popular/getlist',async function (req, res) {
        var vechilebrandlist = await VehicletypeModel.find({_id:req.body.Vehicle_Type_id});
        console.log(vechilebrandlist);
        VehicleNameModel.find({Vehicle_Type:req.body.Vehicle_Type_id,Popular_Vehicle: true}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          console.log(Vehicledetails);
          var response_data = [];
          for(let a  = 0 ; a < Vehicledetails.length ; a ++){
  let d = {
         _id : Vehicledetails[a]._id,
         Vehicle_Type_id : Vehicledetails[a].Vehicle_Type,
         Vehicle_Brand_id : Vehicledetails[a].Vehicle_Brand_id._id,
         Vehicle_Type_Name : vechilebrandlist[0].Vehicle_Type,
         Vehicle_Brand_Image : "",
         Vehicle_Brand_Name :  Vehicledetails[a].Vehicle_Brand_id.Vehicle_Brand_Name,
         Vehicle_Details : [{
         Fuel_Type : Vehicledetails[a].Fuel_Type,
         Vehicle_Model : Vehicledetails[a].Vehicle_Model,           
        _id : Vehicledetails[a]._id,
        Vehicle_Brand_id : Vehicledetails[a].Vehicle_Brand_id._id,
        Vehicle_Image : Vehicledetails[a].Vehicle_Image,
        Vehicle_Name : Vehicledetails[a].Vehicle_Name,
        updatedAt : Vehicledetails[a].updatedAt,
        createdAt : Vehicledetails[a].createdAt,
        "Vehicle_CC": Vehicledetails[a].Vehicle_CC,
        "mfg_year_start":Vehicledetails[a].mfg_year_start,
        "mfg_year_end": Vehicledetails[a].mfg_year_end,
        __v : 0
                    }]
          }
           response_data.push(d);
           if(a == Vehicledetails.length - 1){
             if(req.body.search_string == ""){
              res.json({Status:"Success",Message:"Vehicledetails", Data : response_data ,Code:200});
             } else {
               search_datas = [];
               var keyword = req.body.search_string.toLowerCase();
               console.log(keyword);
               for(let b = 0; b < response_data.length ; b++){
                var barnd_change_low = response_data[b].Vehicle_Brand_Name.toLowerCase();
                var vehiname_change_low = response_data[b].Vehicle_Details[0].Vehicle_Name.toLowerCase();   
                   console.log(vehiname_change_low.indexOf(keyword) !== -1) ;
                        console.log(barnd_change_low.indexOf(keyword) !== -1) ;
                 if(barnd_change_low.indexOf(keyword) !== -1 == true){
                   search_datas.push(response_data[b]);
                 }else{
                    if(vehiname_change_low.indexOf(keyword) !== -1 == true){
                      console.log("Vehicle name In");
                       search_datas.push(response_data[b]);
                    }
                 }
                 if(b == response_data.length -1){
                   res.json({Status:"Success",Message:"Vehicledetails", Data : search_datas ,Code:200});
                 }
               }
             }
           }
          }         
        }).populate('Fuel_Type Vehicle_Model Vehicle_Brand_id');
});


router.get('/getlist', function (req, res) {
        VehiclebrandtypeModel.find({}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});




router.post('/mobile/brandlist',async function (req, res) {
       var vechilename = await VehcilenNameModel.find({}).populate('Fuel_Type Vehicle_Model');
       var vechilebrandlist = await VehiclebrandtypeModel.find({Vehicle_Type_id:req.body.Vehicle_Type_id});
       var Branddetails = [];
       for(let a = 0 ; a < vechilebrandlist.length ; a ++){
       	let d = 
       	{
_id:vechilebrandlist[a]._id,
Vehicle_Type_id: vechilebrandlist[a].Vehicle_Type_id,
Vehicle_Brand_Image: vechilebrandlist[a].Vehicle_Brand_Image,
Vehicle_Brand_Name: vechilebrandlist[a].Vehicle_Brand_Name,
Vehicle_name_list: []
}
  Branddetails.push(d)
  if(a ==  vechilebrandlist.length - 1){
      for(let k = 0 ; k < Branddetails.length ; k ++){
      	for(let j = 0 ; j < vechilename.length ; j ++){
      		// console.log(Branddetails[k]._id,vechilename[j].Vehicle_Brand_id);
      		if(""+Branddetails[k]._id == ""+vechilename[j].Vehicle_Brand_id){
            // console.log("dfdfdfd",Branddetails[k]._id,vechilename[j].Vehicle_Brand_id)
      			Branddetails[k].Vehicle_name_list.push(vechilename[j]);
      		}
      	}
      	// console.log(k,Branddetails.length - 1);
          if(k == Branddetails.length - 1){
          	 // res.json({Status:"Success",Message:"Vehicledetails", Data : Branddetails ,Code:200});
             if(req.body.search_string == ""){
              res.json({Status:"Success",Message:"Vehicledetails", Data : Branddetails ,Code:200});
             } else {
               search_datas = [];
               var keyword = req.body.search_string.toLowerCase();
               console.log(keyword);
               for(let b = 0; b < Branddetails.length ; b++){
                var barnd_change_low = Branddetails[b].Vehicle_Brand_Name.toLowerCase();
                 if(barnd_change_low.indexOf(keyword) !== -1 == true){
                   search_datas.push(Branddetails[b]);
                 }else{
                     for(let c = 0 ; c < Branddetails[b].Vehicle_name_list.length ; c ++){
                      var check_count = 0;
                      var vehiname_change_low = Branddetails[b].Vehicle_name_list[c].Vehicle_Name.toLowerCase(); 
                       if(vehiname_change_low.indexOf(keyword) !== -1 == true){
                       console.log("Vehicle name In");
                       check_count = 1
                       }
                       if(c == Branddetails[b].Vehicle_name_list.length - 1){
                        if(check_count == 1){
                          search_datas.push(Branddetails[b]);
                        }
                       }
                     }
                 }
                 if(b == Branddetails.length -1){
                   res.json({Status:"Success",Message:"Vehicledetails", Data : search_datas ,Code:200});
                 }
               }
             }
          }
      }

  }
       }
        // await VehiclebrandtypeModel.find({Vehicle_Type_id:req.body.Vehicle_Type_id}, function (err, Vehicledetails) {
        //   if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        //   if(Vehicledetails == ""){
        //     return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
        //   }
        //   res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        // });
});

router.post('/vehiclewithbrand', function (req, res) {
        VehiclebrandtypeModel.find({Vehicle_Type_id:req.body.Vehicle_Type_id}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});

router.post('/addvehicle', function (req, res) {
        VehiclebrandtypeModel.find({}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});
router.post('/vehicletypegetlist', function (req, res) {
        VehiclebrandtypeModel.find({Vehicle_Type_id:req.body.Vehicle_Type_id}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data :[],Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        }).populate('Vehicle_Type_id');
});

router.get('/getlist', function (req, res) {
        VehiclebrandtypeModel.find({}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data :[],Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});

router.get('/vehiclename', function (req, res) {
        VehiclebrandtypeModel.find({Vehicle_Name:req.body.Vehicle_Name}, function (err, Vehicledetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [],Code:404});
          }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});
router.put('/edit', function (req, res) {
        VehiclebrandtypeModel.findByIdAndUpdate(req.body.Vehiclebrand_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Vehicledetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      VehiclebrandtypeModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Vehicle Deleted successfully", Data : {} ,Code:200});
      });
});

router.post('/popular/delete', function (req, res) {
      PopularVehicleModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Deleted successfully", Data : {} ,Code:200});
      });
});
router.delete('/deletes', function (req, res) {
      VehiclebrandtypeModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Vehicles Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;