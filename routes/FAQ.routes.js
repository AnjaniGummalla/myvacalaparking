var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var FAQModel = require('./../models/FAQModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{
     await FAQModel.create({
          Question : req.body.Question,
          Answer:req.body.Answer,
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

router.get('/getlist', function (req, res) {
        FAQModel.find({}, function (err, FAQ) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(FAQ == ""){
            return res.json({Status:"Failed",Message:"No Data found", Data : [] ,Code:404});
          }
          res.json({Status:"Success",Message:"FAQ Details", Data : FAQ ,Code:200});
        }).populate('Vehicle_Type_id');
});

router.put('/edit', function (req, res) {
        FAQModel.findByIdAndUpdate(req.body.FAQ_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Vehicledetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      FAQModel.findByIdAndRemove(req.body.FAQ_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      FAQModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Vehicles Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;