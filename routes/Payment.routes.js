var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var Payment = require('./../models/PaymentModel');

router.post('/create', async function(req, res) {

        let request = req.body;
        let Customer_id = req.body.Customer_id;

       await Payment.create({
          Mechanic_Name: req.body.Mechanic_Name,
          Garage_Name: req.body.Garage_Name,
          Customer_id: req.body.Customer_id,
          Payment_type: req.body.Payment_type,
          Payment_amount: req.body.payment_amount,
          Date_of_payment: req.body.Date_of_payments,
          Pay_by_email_id: req.body.Pay_by_email_id,
          Pay_by_name: req.body.Pay_by_name,
          Pay_by_Image: req.body.Pay_by_Image,
          Booking_id: req.body.Booking_id,
          Vehicle_Number:req.body.Vehicle_Number,
          Invoice:req.body.Invoice,
          UTR:req.body.UTR,
          Invoice_Date:req.body.Invoice_Date,
          Payment_Status:req.body.Payment_Status
        }, 

       async function (err, data) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          console.log(err)
          res.json({Status:"Success",Message:"Payment Details Inserted successfully", Data : {},Code:200});
        });

});

router.get('/getlist', function (req, res) {
        Payment.find({}, function (err, Payment_Details) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Payment Details", Data : Payment_Details ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      Payment.findByIdAndRemove(req.body.Payment_id, function (err, user) {
          if (err) returnres.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.success(200, "Data Deleted Successfully");
      });
});

router.delete('/deletes', function (req, res) {
      Payment.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Data Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;