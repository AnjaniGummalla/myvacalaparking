var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var NotificationModel = require('./../models/NotificationModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{
     await NotificationModel.create({
          Title : req.body.Title,
          Message:req.body.Message,
          Message_Status : req.body.Message_Status,
          Date_Time:req.body.Date_Time,
          Booking_id:req.body.Booking_id,
          Customer_id:req.body.Customer_id
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



router.post('/admin/notification/send', async function(req, res) {
  try{
     await NotificationModel.create({
          Title : req.body.Title,
          Message:req.body.Message,
          Message_Status : req.body.Message_Status,
          Date_Time:req.body.Date_Time,
          Booking_id:req.body.Booking_id,
          Customer_id: "Admin"
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


router.post('/admin/notification/fetch', async function(req, res) {
   NotificationModel.find({Customer_id:req.body.Customer_id,Message_Status :'unread'}, function (err, Notification) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Notification == ""){
            return res.json({Status:"Failed",Message:"No Data found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Notifications", Data : Notification ,Code:200});
    });
});




router.post('/mobile/getlist', function (req, res) {
        NotificationModel.find({Customer_id:req.body.Customer_id}, function (err, Notification) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Notification == ""){
            return res.json({Status:"Failed",Message:"No Data found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Notifications", Data : Notification ,Code:200});
        });
});
router.get('/admin/getlist', function (req, res) {
        NotificationModel.find({}, function (err, Notification) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Notification == ""){
            return res.json({Status:"Failed",Message:"No Data found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Notifications", Data : Notification ,Code:200});
        });
});
router.put('/mobile/edit', function (req, res) {
        NotificationModel.findByIdAndUpdate(req.body.Notification_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Vehicledetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      NotificationModel.findByIdAndRemove(req.body.Notification_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      NotificationModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:" Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;