var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var MasterServiceModel = require('./../models/MasterserviceModel');
var HomebannerModel = require('./../models/HomebannerModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');
var mobileappdetailsModel = require('./../models/mobileappdetailsModel');

router.post('/create',[
    check('Masterservice_Name').not().isEmpty().withMessage("Not a valid Name"),
    check('Service_Image').not().isEmpty().withMessage("Please upload a Image"),
    check('Desc').not().isEmpty().withMessage("Please provide valid Description"),
  ], async function(req, res) {
  try{
      const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
     await MasterServiceModel.create({
          Masterservice_Name : req.body.Masterservice_Name,
          //Vehicle_type_Name:req.body.Vehicle_Name,
          //Vehicle_type_id:req.body.Vehicle_type_id,
          Service_Image : req.body.Service_Image,
          Serviceavailable_Location:req.body.Serviceavailable_Location,
          Desc : req.body.Desc,
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


router.get('/getlist', async function (req, res) {
  
      await MasterServiceModel.find({}, async function (err, Servicedetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
        
          res.json({Status:"Success",Message:"Servicedetails", Data : Servicedetails ,Code:200});
        });
});

router.post('/mobile/getlist', async function (req, res) {
  
      await MasterServiceModel.find({Serviceavailable_Location:{ $in: req.body.Serviceavailable_Location }}, async function (err, Servicedetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
           var Mobile_details = await mobileappdetailsModel.find({});
           var Homebannerlist = await HomebannerModel.find({});
           let responsedata = {
            services: Servicedetails,
            Banners: Homebannerlist,
            Mobile_details : Mobile_details,
           }
          res.json({Status:"Success",Message:"Servicedetails", Data : responsedata ,Code:200});
        });
});

router.get('/locationlist', function (req, res) {
  
        LocationModel.find({}, function (err, Locationdetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Locationdetails", Data : Locationdetails ,Code:200});
        });
});
router.post('/edit', function (req, res) {
        MasterServiceModel.findByIdAndUpdate(req.body.Service_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) returnres.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Servicedetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      MasterServiceModel.findByIdAndRemove(req.body.Service_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Service Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      MasterServiceModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Service Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;