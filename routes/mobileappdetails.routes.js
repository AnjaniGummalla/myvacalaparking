var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var mobileappdetailsModel = require('./../models/mobileappdetailsModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{
     await mobileappdetailsModel.create({
          mobileappdetails : req.body.mobileappdetails,
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Mobile Details Git Added successfully", Data :user ,Code:200}); 
    });      
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.get('/getlist', function (req, res) {
        mobileappdetailsModel.find({}, function (err, FAQ) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(FAQ == ""){
            return res.json({Status:"Failed",Message:"No Data found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Mobile Details Git Details", Data : FAQ ,Code:200});
        }).populate('Vehicle_Type_id');
});

router.get('/mobile/getlist', function (req, res) {
        mobileappdetailsModel.find({}, function (err, FAQ) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(FAQ == ""){
            return res.json({Status:"Failed",Message:"No Data found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Mobile Details Git Details", Data : FAQ ,Code:200});
        }).populate('Vehicle_Type_id');
});

router.post('/edit', function (req, res) {
        mobileappdetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Mobile Details Git Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      mobileappdetailsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Mobile Details Git Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      mobileappdetailsModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Mobile Details Git Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;