var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var CartModel = require('./../models/CartModel');
var VehicletypeModel = require('./../models/VehicletypeModel');
var MasterServiceModel = require('./../models/MasterserviceModel');
var Customer_LocationModel = require('./../models/Customer_LocationModel');
var HomebannerModel = require('./../models/HomebannerModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');
var VehicleModel = require('./../models/VehicleModel');

router.post('/create',[

    //check('Customer_id').not().isEmpty().withMessage("Not a valid Data"),
    //check('Arrival_Mode').not().isEmpty().withMessage("Please provide valid Data"),
    check('Sub_service_id').not().isEmpty().withMessage("Please provide valid Data"),
  ], async function(req, res) {
  try{
       console.log(req.body);
     const errors = validationResult(req);
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
    }
    console.log("*******************");
    var vehicle_type = await VehicletypeModel.findOne({_id:req.body.Vehicletype_id});
    var Vehicle_type = "";
    if(vehicle_type.Vehicle_Type == "Four Wheeler"){
        Vehicle_type = "Two Wheeler";   
    }else {
        Vehicle_type = "Four Wheeler"; 
    }  
    console.log("Vehicle_type",Vehicle_type);
 var type_check = await CartModel.findOne({Customer_id:req.body.Customer_id,Vehicle_type:Vehicle_type});
 if(type_check !== null){
  console.log("Cheikakdfa",type_check);
    var deleted = await CartModel.findByIdAndRemove({_id:type_check._id});
 }
 var customercartcheck = await CartModel.findOne({Customer_id:req.body.Customer_id});
 if(customercartcheck == null){
  let datas = [];
  datas.push(req.body.Sub_service_id);
  console.log("Vehicle_type_name",vehicle_type.Vehicle_Type);
 await CartModel.create({
          Item_Details : datas,
          Customer_id: req.body.Customer_id,
          Vehicle_type:vehicle_type.Vehicle_Type,
          Vehicle_details : req.body.Vehicle_details
        },
        function (err, user) {
        res.json({Status:"Success",Message:"Item Added successfully", Data : {} ,Code:200}); 
    });      
 }
 else{
  customercartcheck.Item_Details.push(req.body.Sub_service_id);
  let updatedata = {
          "Item_Details" : customercartcheck.Item_Details,
  }
  var CartUpdate = await CartModel.findOneAndUpdate({Customer_id:req.body.Customer_id},updatedata, {new: true});
  res.json({Status:"Success",Message:"Item Updated successfully", Data : {} ,Code:200});
 }  
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



// router.post('/mobile/mainservicegetlist', async function (req, res) {
//         await ServiceModel.find({Vehicle_Type_id:req.body.Vehicle_Type_id,Master_Service_id:req.body.Master_Service_id}, async function (err, Servicedetails) {
//           if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//            if(Servicedetails == ""){
//             return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
//            }
//            var Homebanner = await HomebannerModel.find({});
//            let responseData = {
//             mainserviceslist:Servicedetails,
//             Bannerlist:Homebanner
//            }
//           res.json({Status:"Success",Message:"Servicedetails", Data : responseData ,Code:200});
//         });
// });



router.post('/customer/getcartdetails', async function (req, res) {  
       var locationData = await Customer_LocationModel.findOne({Customer_id:req.body.Customer_id,Status:"Default"});
        var locationDatas = await Customer_LocationModel.find({Customer_id:req.body.Customer_id});
       var CustomerVehicleData = await VehicleModel.find({Customer_id:req.body.Customer_id,Status:"Default"});
        var location_details = [];
        var Master_service = await MasterServiceModel.findOne({Masterservice_Name:"Book A Mechanic"});
        console.log(locationData);
          let check = 0 ;
        for(let l = 0 ; l < Master_service.Serviceavailable_Location.length ; l ++){
            for(let k = 0 ; k < locationDatas.length; k ++){
              console.log(Master_service.Serviceavailable_Location[l],locationDatas[k].City)
                 if(Master_service.Serviceavailable_Location[l] == locationDatas[k].City){
                  location_details.push(locationDatas[k]);
                 }
            }
        }
        console.log(location_details);
        await CartModel.findOne({Customer_id:req.body.Customer_id}, function (err, Servicedetails) {
          if(Servicedetails == null){
            let data = {
                  "Item_Details" : [],
                  "_id": "",
                  "Customer_id": req.body.Customer_id,
                  "Vehicle_details": [],
                  "Vehicle_type": "",
                  "updatedAt": "",
                  "createdAt": "",
                  "Original_Price" : 0,
                  "Discount_Price" : 0,
                  "__v": 0
                }
                res.json({Status:"Success",Message:"No data Found, Please add Some Items", Data : data ,locationData : locationData,location_available:location_details,CustomerVehicleData : CustomerVehicleData, Code:300});
          }
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},locationData : locationData ,location_available:location_details,CustomerVehicleData : CustomerVehicleData,Code:500});
           if(Servicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},locationData : locationData ,location_available:location_details,CustomerVehicleData : CustomerVehicleData,Code:404});
           }
           var datass = Servicedetails.Item_Details;
           Original_Price = 0;
           Discount_Price = 0;
          if(datass.length == 0){
           let data = {
                  "Item_Details" : Servicedetails.Item_Details,
                  "_id": Servicedetails._id,
                  "Customer_id": Servicedetails.Customer_id,
                  "Vehicle_details": Servicedetails.Vehicle_details,
                  "Vehicle_type": Servicedetails.Vehicle_type,
                  "updatedAt": Servicedetails.updatedAt,
                  "createdAt": Servicedetails.createdAt,
                  "Original_Price" : Original_Price,
                  "Discount_Price" : Discount_Price,
                  "__v": 0
                }
                res.json({Status:"Success",Message:"Servicedetails", Data : data ,locationData : locationData ,location_available:location_details,CustomerVehicleData : CustomerVehicleData,Code:200});
           }else {
              for(let a  = 0 ; a < datass.length ; a ++){
               Original_Price = Original_Price +  +datass[a].Original_Price;
               Discount_Price = Discount_Price +  +datass[a].Discount_Price;
               if(a == datass.length - 1){
                console.log(Original_Price,Discount_Price);
                items_list = Servicedetails.Item_Details;
                final_result = [];
                console.log("*****************");
                console.log(items_list.length);
                for(b = 0 ; b < items_list.length; b++ ){
                     var check = 0 ;
                      if(b == 0){
                        final_result.push(items_list[b]); 
                      }else{
                         for(c = 0 ; c < final_result.length;c ++){
                          if(final_result[c].id == items_list[b]._id){
                            check = 1 ;
                          }
                          if(c == final_result.length - 1){
                              if(check == 0){
                               final_result.push(items_list[b]); 
                              }
                          }
                      }
                      }
                    if(b == items_list.length - 1){
                       for(let e = 0 ; e < Servicedetails.Item_Details.length; e ++){
                           for(let f = 0 ; f < final_result.length ; f ++){
                                if(Servicedetails.Item_Details[e]._id == final_result[f]._id){
                                  final_result[f].Cart_count = final_result[f].Cart_count + 1;
                                  final_result[f].Original_Price = Servicedetails.Item_Details[e].Original_Price * final_result[f].Cart_count;
                                  final_result[f].Discount_Price = Servicedetails.Item_Details[e].Discount_Price * final_result[f].Cart_count;
                                }
                           }
                           if(e == Servicedetails.Item_Details.length - 1){
                               console.log("finale",final_result);
                       let data = {
                  "Item_Details" : final_result,
                  "_id": Servicedetails._id,
                  "Customer_id": Servicedetails.Customer_id,
                  "Vehicle_details": Servicedetails.Vehicle_details,
                  "Vehicle_type": Servicedetails.Vehicle_type,
                  "updatedAt": Servicedetails.updatedAt,
                  "createdAt": Servicedetails.createdAt,
                  "Original_Price" : Original_Price,
                  "Discount_Price" : Discount_Price,
                  "__v": 0
                }
                res.json({Status:"Success",Message:"Servicedetails", Data : data,locationData : locationData ,location_available:location_details,CustomerVehicleData : CustomerVehicleData,Code:200});
                           }
                       }     
                    }   
                }
               }
           }
           }          
        }).populate('Item_Details');
});



router.get('/admin/getlist', async function (req, res) {
        await CartModel.find({}, function (err, Servicedetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Servicedetails", Data : Servicedetails ,Code:200});
        }).populate('Master_Service_id Vehicle_Type Customer_id Item_Details');
});


router.post('/Cartremoved', async function (req, res) {
        await CartModel.find({Customer_id:req.body.Customer_id}, async function (err, Servicedetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             var datas = Servicedetails[0];
             var datas1 = Servicedetails[0].Item_Details.length;
             console.log(datas);
             console.log(datas.Item_Details.length);
             var item_index = 0;
             for(let a = 0 ; a < datas.Item_Details.length ; a ++){
              console.log(""+datas.Item_Details[a],""+req.body.Service_id);
              if(""+datas.Item_Details[a] == ""+req.body.Service_id){
                item_index = a;
              }
              console.log(a,datas1 - 1);
              if(a == +datas1 - 1){
                console.log(item_index);
                datas.Item_Details.splice(item_index, 1);
                console.log("It is removed",Servicedetails[0]._id);
                console.log("What is datas", datas);
                const filter = {_id:Servicedetails[0]._id};
                var CartUpdate = await CartModel.findByIdAndUpdate(filter,datas);
                console.log(CartUpdate)
                 res.json({Status:"Success",Message:"Servicedetailsss", Data : CartUpdate ,Code:200});
              }
             }
        });
});



// router.post('/Cartremoved', async function (req, res) {
//   try{
//   var UpdatedData = await CartModel.update({Customer_id:req.body.Customer_id},{ $pull: {Item_Details :{$in:req.body.Service_id}}},{
//   new: true
// });
//   console.log(UpdatedData);
//   var FinalData = await CartModel.find({Customer_id:req.body.Customer_id});
//   res.json({Status:"Success",Message:"Item removed Successfully", Data : {} ,Code:200});
//   } 
//   catch(e){
//     console.log(e)
//     res.json({Status:"Failed",Message:"Internal server error", Data : {} ,Code:200});
//   }
// });
           
// router.get('/locationlist', async function (req, res) {
//         LocationModel.find({}, function (err, Locationdetails) {
//           if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//           res.json({Status:"Success",Message:"Locationdetails", Data : Locationdetails ,Code:200});
//         });
// });
router.put('/edit', async function (req, res) {
        await ServiceModel.findByIdAndUpdate(req.body.Service_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"Servicedetails Updated", Data : UpdatedDetails ,Code:200});
        });
});

// // // DELETES A USER FROM THE DATABASE
router.post('/delete', async function (req, res) {
      await CartModel.findByIdAndRemove(req.body.Cart_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Service Deleted successfully", Data : {} ,Code:200});
      });
});


router.delete('/deletes', function (req, res) {
      CartModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Items Deleted successfully", Data : {} ,Code:200});
      });
});




module.exports = router;