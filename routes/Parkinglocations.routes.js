var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var ParkingLocationModel = require('./../models/ParkingLocationModel');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{
        await ParkingLocationModel.create({
            Location_Name:req.body.Location_Name,
            Pincodes: req.body.Pincodes,
            Image: req.body.Image,
            Lat:req.body.Lat,
            Long:req.body.Long,
            Display_Name:req.body.Display_Name,
            Disable:req.body.Disable || false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/admin/getlist', async function (req, res) {
      await ParkingLocationModel.find({}, function (err, Locationdetails) {
          res.json({Status:"Success",Message:"Locationdetails", Data : Locationdetails ,Code:200});
        });
});

router.get('/mobile/getlist', async function (req, res) {
      await ParkingLocationModel.find({Disable:false}, function (err, Locationdetails) {
          res.json({Status:"Success",Message:"Locationdetails", Data : Locationdetails ,Code:200});
        });
});

router.put('/edit', function (req, res) {
        ParkingLocationModel.findByIdAndUpdate(req.body.Location_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Locationdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      ParkingLocationModel.findByIdAndRemove(req.body.Location_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Location Deleted successfully", Data : {} ,Code:200});
      });
});
router.delete('/deletes', function (req, res) {
      ParkingLocationModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Location Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;