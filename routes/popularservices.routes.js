var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var PopularServicesModel = require('./../models/PopularServicesModel');
var ServicebannerModel = require('./../models/ServicesBannerModel');
var HomebannerModel = require('./../models/HomebannerModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create',[
    check('Service_Name').not().isEmpty().withMessage("Not a valid Name"),
    check('Master_Service_id').not().isEmpty().withMessage("Please provide valid Details"),
    check('Desc').not().isEmpty().withMessage("Please provide valid Description"),
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
     await PopularServicesModel.create({
          Heading : req.body.Heading || "",
          Vehicletype:req.body.Vehicletype || "",
          Location:req.body.Location || "",
          Popular_Service_Name: req.body.Popular_Service_Name || "",
          Sub_Title: req.body.Sub_Title || "",
          Vehicle_Name:req.body.Vehicle_Name || "",
          //Vehicle_Name_id:req.body.Vehicle_Name_id || "",
          Service_Image : req.body.Service_Image || "",
          Desc : req.body.Desc || "",
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
        await PopularServicesModel.find({Vehicle_Type_id:req.body.Vehicle_Type_id,Master_Service_id:req.body.Master_Service_id}, async function (err, Servicedetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
           var Servicebanner = await ServicebannerModel.find({Master_Service_id:req.body.Master_Service_id});
           let responseData = {
            mainserviceslist:Servicedetails,
            Bannerlist:Servicebanner
           }
          res.json({Status:"Success",Message:"Servicedetails", Data : responseData ,Code:200});
        });
});
router.get('/getlistfull', async function (req, res) {
        await PopularServicesModel.find({}, function (err, Servicedetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Servicedetails", Data : Servicedetails ,Code:200});
        });
});
router.post('/getlistwithtype', async function (req, res) {
        await PopularServicesModel.find({Vehicle_Type:req.body.Vehicle_Type}, function (err, Servicedetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Servicedetails", Data : Servicedetails ,Code:200});
        }).populate('Vehicle_Type');
});
router.get('/locationlist', async function (req, res) {
        LocationModel.find({}, function (err, Locationdetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Locationdetails", Data : Locationdetails ,Code:200});
        });
});
router.put('/edit', async function (req, res) {
        await PopularServicesModel.findByIdAndUpdate(req.body.Service_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"Servicedetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', async function (req, res) {
      await PopularServicesModel.findByIdAndRemove(req.body.Service_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Service Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      PopularServicesModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Service Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;