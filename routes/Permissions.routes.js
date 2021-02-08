var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var PermissionModel = require('./../models/PermissionModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create',VerifyToken, async function(req, res) {
  try{
     await PermissionModel.create({
          Employee_Id: req.body.Employee_Id,
          Dashboard : req.body.Dashboard,
          VendorManagement : req.body.VendorManagement,
          AppManagement : req.body.AppManagement,
          Bookings : req.body.Bookings,
          Finance : req.body.Finance,
          CustomerCare : req.body.CustomerCare,
          Statatics : req.body.Statatics,
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

router.get('/getlist', VerifyToken, function (req, res) {
  
        PermissionModel.find({}, function (err, Premissiondetails) {
          res.json({Status:"Success",Message:"Premissiondetails", Data : Premissiondetails ,Code:200});
        });
});

router.put('/edit', VerifyToken, function (req, res) {
        PermissionModel.findByIdAndUpdate(req.body.Premission_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) returnres.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Premissiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete',VerifyToken, function (req, res) {
      PermissionModel.findByIdAndRemove(req.body.Premission_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Premission Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', VerifyToken, function (req, res) {
      PermissionModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Premissions Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;