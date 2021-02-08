var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var PopularSubserviceModel = require('./../models/Popularsubservices');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create',[
    check('PopularService_id').not().isEmpty().withMessage("Not a valid Name"),
    check('PopularService_Name').not().isEmpty().withMessage("Please provide valid Details"),
    check('Specifications').not().isEmpty().withMessage("Please provide valid Description"),
  ], async function(req, res) {
  try{
    const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    } 
     await PopularSubserviceModel.create({
          PopularService_id : req.body.PopularService_id,
          PopularService_Name:req.body.PopularService_Name,
          Specifications: req.body.Specifications,
          //Vehiclename:req.body.Vehiclename,
          Price: req.body.Price,
          Discount_Price: req.body.Discount_Price,
          Included:req.body.Included,
          Service_Image: req.body.Service_Image,
          Thumb_Line_Image: req.body.Thumb_Line_Image,
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

router.get('/admin/getlist', async function (req, res) {
       await PopularSubserviceModel.find({}, function (err, Subservicedetails) {
         if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Subservicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [],Code:404});
           }
          res.json({Status:"Success",Message:"Subservicedetails", Data : Subservicedetails ,Code:200});
        });
});

router.post('/mobile/subservicelist', async function (req, res) {
       await PopularSubserviceModel.find({PopularService_id:req.body.PopularService_id}, function (err, Servicedetails) {
        if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [] ,Code:404});
           }
          res.json({Status:"Success",Message:"Servicedetails with subservices", Data : Servicedetails ,Code:200});
        });
});

router.put('/edit', function (req, res) {
        PopularSubserviceModel.findByIdAndUpdate(req.body.PopularSubservice_id, req.body, {new: true}, function (err, UpdatedDetails) {
        if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [] ,Code:404});
           }
             res.json({Status:"Success",Message:"Subservicedetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      PopularSubserviceModel.findByIdAndRemove(req.body.PopularSubservice_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [] ,Code:404});
           }
          res.json({Status:"Success",Message:"Subservice Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      PopularSubserviceModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Subservice Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;