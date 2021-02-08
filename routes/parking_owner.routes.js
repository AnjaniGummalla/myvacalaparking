var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var Parking_owner_Model = require('./../models/parking_owner_Model');
var parking_details_Model = require('./../models/parking_details_Model');
var RM = require('random-number');
const requestss = require("request");
const randomstring = require('random-string');

router.post('/create', async function(req, res) {
  try{
    var Booking_id = randomstring({
      length: 5,
      numeric: true,
      letters: true,
      special: false,
      exclude: ['a', 'b', 'c','d', 'e', 'f','g', 'h', 'i','j', 'k', 'l','m', 'n', 'o','p', 'q', 'r', 's' ,'t','w','x', 'y','z']
});
        await Parking_owner_Model.create({
              owner_name:  req.body.owner_name || "",
              owner_email : req.body.owner_email || "",
              owner_pri_contact : req.body.owner_pri_contact || "",
              owner_sec_contact : req.body.owner_sec_contact || "",
              owner_pan_no : req.body.owner_pan_no || "",
              owner_pan_file : req.body.owner_pan_file || "",
              owner_aadhar_no : req.body.owner_aadhar_no || "",
              owner_aadhar_file : req.body.owner_aadhar_file || "",
              owner_res_address : req.body.owner_res_address  || "",
        },async function (err, user) {
          console.log(user)
        let driverfields ={
                parking_owner_id: user._id || "",
                parking_vendor_id : "Park-"+Booking_id,
                parking_details_update_status : "Not Updated",
                parking_details_name:  req.body.parking_details_name || "",
                parking_details_address : req.body.parking_details_address || "",
                parking_details_gstaddress : req.body.parking_details_gstaddress || "",
                parking_details_gstdoc : req.body.parking_details_gstdoc || "",
                parking_details_gstno : req.body.parking_details_gstno || "",
                parking_details_maplink : req.body.parking_details_maplink || "",
                parking_details_lat : 0,
                parking_details_long : 0,
                parking_details_pocemail : req.body.parking_details_pocemail || "",
                parking_details_slots_count_Bike : 0 ,
                parking_details_slots_count_Car : 0 ,
                 parking_prices: 0,
                 parking_distance: 0,
                 parking_reach_time: 0,
                parking_details_slots_Bike_details : [],
                parking_details_slots_Car_details :  [],
                ///slot prices//
                parking_details_price_bike_type :  false,
                parking_details_price_car_type :  false,
                parking_details_price_both_type :  false,
                parking_details_bike_price_day : [
                {
                  "Title":"Sunday",
                   "Timings":[]
                },
                {
                  "Title":"Monday",
                  "Timings":[]
                },
                {
                  "Title":"Tuesday",
                   "Timings":[]
                },
                {
                  "Title":"Wednesday",
                   "Timings":[]
                },
                {
                  "Title":"Thursday",
                  "Timings":[]
                },
                {
                  "Title":"Friday",
                   "Timings":[]
                },
                {
                  "Title":"Saturday",
                   "Timings":[]
                }
                ],
                parking_details_bike_price_spe_day : [],
                parking_details_car_price_day : [
                {
                  "Title":"Sunday",
                  "Timings":[]
                },
                {
                  "Title":"Monday",
                  "Timings":[]
                },
                {
                  "Title":"Tuesday",
                   "Timings":[]
                },
                {
                  "Title":"Wednesday",
                  "Timings":[]
                },
                {
                  "Title":"Thursday",
                   "Timings":[]
                },
                {
                  "Title":"Friday",
                   "Timings":[]
                },
                {
                  "Title":"Saturday",
                  "Timings":[]
                }
                ],
                parking_details_car_price_spe_day : [],
        }
        var DriverData = await parking_details_Model.create(driverfields);
        res.json({Status:"Success",Message:"Parking Owner Created successfully", owner_details : user ,parking_Details : DriverData ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/deletes', function (req, res) {
      Parking_owner_Model.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Parking Owner Deleted all", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        Parking_owner_Model.findOne({owner_pri_contact:req.body.owner_pri_contact}, function (err, StateList) {
          if(StateList == null){
            res.json({Status:"Success",Message:"New User", Data : {} ,Code:200});
          }else{
            res.json({Status:"Success",Message:"Exist User", Data : {} ,Code:400});
          }
        });
});


router.post('/parking_vendor_login',async function (req, res) {
        Parking_owner_Model.findOne({owner_pri_contact:req.body.owner_pri_contact},async function (err, StateList) {
          if(StateList == null){
            res.json({Status:"Success",Message:"Account Not Found", Data : {} ,Code:400});
          }else{
            var phonecheck = await parking_details_Model.findOne({parking_owner_id:""+StateList._id}).populate('parking_owner_id');
            console.log(phonecheck);
        var options = {
      min:  1000,
      max: 10000,
      integer: true
    }
     var OTP = RM(options);
         var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.owner_pri_contact;
        var message =
          "Hi, Your OTP is " + OTP + ". My Vacala OTP for login.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls =
          "http://www.smsintegra.com/" +
          "api/smsapi.aspx?uid=" +
          username +
          "&pwd=" +
          password +
          "&mobile=" +
          mobilno +
          "&msg=" +
          message +
          "&sid=" +
          dumbell +
          "&type=" +
          tye;
        console.log(baseurls);
        requestss(baseurls, { json: true }, async (err, response, body) => {
          if (err) {
            return console.log(err);
          }
          else{
        res.json({Status:"Success",Message:"OTP has been sent successfully for the registred mobile number", Data : phonecheck , OTP : OTP ,Code:200});
          }
        });
          }
        });
});





router.get('/getlist', function (req, res) {
        Parking_owner_Model.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Parking Owner List", Data : Functiondetails ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        Parking_owner_Model.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Parking Owner Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      Parking_owner_Model.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Parking Owner Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;

