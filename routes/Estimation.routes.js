var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var EstimationModel = require('./../models/EstimationModel');
var Estimation_ProductModel = require('./../models/Estimation_productModel')
const randomstring = require('randomstring');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{
     await EstimationModel.create({
           Mechanic_id : req.body.Mechanic_id,
           Booking_id : req.body.Booking_id,
           Product_Data:req.body.Product_Data,
           Estimation_Cost: req.body.Estimation_Cost,
           Upload_Documents: req.body.Upload_Documents,
           Vehicle_Images:req.body.Vehicle_Images,
           ODO_Reading:req.body.ODO_Reading,
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

router.post('/eachvalue', async function(req, res) {
  try{
     let Partcost = req.body.Part_Cost;
     let Labour_Cost = req.body.Labour_Cost;
     let Quantity = req.body.Quantity;
     let Gstpercent = (req.body.Part_GST_Percent/100);
     let Part_Cost_Without_GST = (Partcost * Quantity);
     let Part_Cost_With_GST =Part_Cost_Without_GST+(Part_Cost_Without_GST * Gstpercent);
     let Total_Amount = (Part_Cost_With_GST + Labour_Cost);

     await Estimation_ProductModel.create({
           Mechanic_id : req.body.Mechanic_id,
           Booking_id : req.body.Booking_id,
           Product_Status : "Raised",
           Product_Description : req.body.Product_Description,
           Quantity: req.body.Quantity,
           Part_Cost_Without_GST: Part_Cost_Without_GST,
           Part_Cost : req.body.Part_Cost,
           Labour_Cost : req.body.Labour_Cost,
           Part_GST_Percent : req.body.Part_GST_Percent,
           Part_Cost_With_GST : Part_Cost_With_GST,
           Total_Amount: Total_Amount,
        }, 
        function (err, user) {
          console.log(err)
        res.json({Status:"Success",Message:"Added successfully", Data :user ,Code:200}); 
    });      
}
catch(e){
  console.log(e)
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.post('/finallist', async function (req, res) {
   var Finalestimation = await EstimationModel.findOne({ Booking_id:req.body.Booking_id}).select('-Product_Data');
    var ProductEstimation = await Estimation_ProductModel.find({Booking_id:req.body.Booking_id});
    let responseData = {
    	ProductEstimation,Finalestimation
    }
    res.json({Status:"Success",Message:"Estimationdetails", Data: responseData ,Code:200});
});

router.post('/getlist', function (req, res) {
        EstimationModel.find({Booking_id:req.body.Booking_id}, function (err, Estimationdetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Estimationdetails", Data : Estimationdetails ,Code:200});
        }).select(' -_id Product_Data');
});

router.post('/getlistproduct', function (req, res) {
        Estimation_ProductModel.find({Booking_id:req.body.Booking_id}, function (err, Estimationdetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Estimationdetails", Data : Estimationdetails ,Code:200});
        });
});
router.post('/individuallist', function (req, res) {
        EstimationModel.find({Mechanic_id:req.body.Mechanic_id}, function (err, Estimationdetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Estimationdetails", Data : Estimationdetails ,Code:200});
        });
});

router.post('/productstatus', function (req, res) {
        Estimation_ProductModel.findByIdAndUpdate(req.body.ProductEstimation_id,req.body, {new: true} ,function (err, Estimationdetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Estimationdetails", Data : Estimationdetails ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        EstimationModel.findByIdAndUpdate(req.body.Estimation_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Estimationdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      EstimationModel.findByIdAndRemove(req.body.Estimation_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Estimation Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes',  function (req, res) {
      EstimationModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Estimation Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;