var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var ServicebannerModel = require('./../models/ServicesBannerModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create' , async function(req, res) {
  try{
     await ServicebannerModel.create({
          ServiceBanner_Image : req.body.ServiceBanner_Image,
          Master_Service_id:req.body.Master_Service_id,
          //Master_Service_Name:req.body.Master_Service_Name,
          Title : req.body.Title,
          Status:req.body.Status,
          Desc: req.body.Desc
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

router.get('/admin/getlist',async function (req, res) {
  
        await ServicebannerModel.find({}, function (err, Roledetails) {
          res.json({Status:"Success",Message:"servicebannerlist", Data : Roledetails ,Code:200});
        });
});

router.post('/mobile/getlist',async function (req, res) {
  
        await ServicebannerModel.find({Master_Service_id:req.body.Master_Service_id}, function (err, Roledetails) {
          res.json({Status:"Success",Message:"Roledetails", Data : Roledetails ,Code:200});
        });
});

router.post('/admin/mastergetlist',async function (req, res) {
  
        await ServicebannerModel.find({Master_Service_id:req.body.Master_Service_id}, function (err, Roledetails) {
          res.json({Status:"Success",Message:"bannerlist", Data : Roledetails ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        ServicebannerModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) returnres.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Roledetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      ServicebannerModel.findByIdAndRemove(req.body.ServiceBanner_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      ServicebannerModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Roles Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;