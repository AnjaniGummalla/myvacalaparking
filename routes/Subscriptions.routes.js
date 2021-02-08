var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var SubscriptionModel = require('./../models/SubscriptionModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{
     await SubscriptionModel.create({
          Title : req.body.Title,
          Desciption:req.body.Desciption,
          Duration : req.body.Duration,
          Price:req.body.Price,
          Included:req.body.Included,
          Subscription_Image:req.body.Subscription_Image
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

router.get('/admin/getlist', function (req, res) {
        SubscriptionModel.find({}, function (err, Subscriptions) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Subscriptions == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Subscriptions", Data : Subscriptions ,Code:200});
        });
});
router.get('/mobile/getlist', function (req, res) {
        SubscriptionModel.find({}, function (err, Subscriptions) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Subscriptions == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Subscriptions", Data : Subscriptions ,Code:200});
        });
});
router.get('/mobile/individual', function (req, res) {
        SubscriptionModel.find({_id:req.body.Subscription_id}, function (err, Subscriptions) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(Subscriptions == ""){
            return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"Subscriptions", Data : Subscriptions ,Code:200});
        });
});
// router.get('/getlist', function (req, res) {
//         SubscriptionModel.find({Popular_Vehicle:true}, function (err, Subscriptions) {
//           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//           if(Subscriptions == ""){
//             return res.json({Status:"Failed",Message:"No vehicles found", Data : [] ,Code:404});
//           }
//           res.json({Status:"Success",Message:"Subscriptions", Data : Subscriptions ,Code:200});
//         });
// });

router.put('/edit', function (req, res) {
        SubscriptionModel.findByIdAndUpdate(req.body.Subscription_id, req.body, {new: true}, function (err, UpdatedDetails) {
          console.log(err)
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Subscriptions Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      SubscriptionModel.findByIdAndRemove(req.body.Subscription_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Subscrptions Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      SubscriptionModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Subscriptions Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;