var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var HomebannerModel = require('./../models/HomebannerModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create' , async function(req, res) {
  try{
     await HomebannerModel.create({
          Homebanner_Image : req.body.Homebanner_Image,
          Title : req.body.Title,
          Status:req.body.Status,
          Date:req.body.Date,
          Time:req.body.Time,
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

router.get('/getlist',async function (req, res) {
  
        await HomebannerModel.find({}, function (err, Roledetails) {
          res.json({Status:"Success",Message:"Roledetails", Data : Roledetails ,Code:200});
        });
});

router.post('/edit', async function (req, res) {
        await HomebannerModel.findByIdAndUpdate(req.body.Banner_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) returnres.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Master Banner Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      HomebannerModel.findByIdAndRemove(req.body.Banner_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      HomebannerModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Roles Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;