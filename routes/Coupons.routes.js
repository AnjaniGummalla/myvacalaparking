var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var CouponsModel = require('./../models/CouponsModel');
var MechanicbookingModel = require('./../models/MechanicbookingModel');
const randomstring = require('random-string');
var CouponsModel = require('./../models/CouponsModel');
var CustomerModel = require('./../models/CustomerModel');
var Customer_LocationModel = require('./../models/Customer_LocationModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create', [
    //check('Customer_id').not().isEmpty().withMessage("Please select the fuel type"),
    //check('Vehicle_Id').not().isEmpty().withMessage("Please provide valid Details"),
    check('Expiry_Date').not().isEmpty().withMessage("Please provide valid Expiry_Date"),
  ], async function(req, res) {
  try{
    const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
    var Expiry_Date1 = req.body.Expiry_Date;
    var Start_Date1 = req.body.Start_Date;
        await CouponsModel.create({
             Coupon_Code:req.body.Coupon_Code  || "",
             Expiry_Date : Expiry_Date1.toString() || "",
             Start_Date : Start_Date1.toString() || "",
             Customer_id : req.body.Customer_id || "",
             Masterservice_id : req.body.Masterservice_id || "",
             Vehicle_type_id : req.body.Vehicle_type_id || "",
             Mainservice_id : req.body.Mainservice_id || "",
             Value_Type:req.body.Value_Type  || "",
             Amount:req.body.Amount  || "",
             Count:req.body.Count  || "",
             Value : req.body.Value  || "",
             Description: req.body.Description  || "",
             Coupon_For: req.body.Coupon_For || "",
             Coupon_status : "Enable" || "",
        }, 
        async function (err, user) {
        console.log(user);
        res.json({Status:"Success",Message:"Added successfully", Data :user ,Code:200}); 
    });        
}
catch(e){
  console.log(e)
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.get('/getlist',function (req, res) {
        CouponsModel.find({}, function (err, Coupons) {
          res.json({Status:"Success",Message:"Coupons", Data : Coupons ,Code:200});
        }).populate('Masterservice_id Vehicle_type_id Mainservice_id');
});


router.post('/codevalidation',async function (req, res) {
  var currentDate = new Date();
 currentDate.setHours(0, 0, 0, 0)
 var couponcode_validation = true;
 var Couponcode_expiry_date = true;
 var Couponcode_start_date = true;
 var message_status = "";
 ///check couponcode validation///
 var Check_coupon_code = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code,Vehicle_type_id:req.body.Vehicle_type_id});
 if(Check_coupon_code == null){
 couponcode_validation = false;
 message_status = "Invalid Coupon Code, Please Enter Valid Coupon Code";
 }
 ///Check Couponcode Expire date //
 var Check_coupon_expiry = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code,Expiry_Date:{$gte:currentDate}});
 if(Check_coupon_expiry == null){
 Couponcode_expiry_date = false;
 message_status = "Coupon Code is Expired, Please Enter any other Coupon Code";
 }
 ///Check Couponcode Start date //
 var Check_coupon_start = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code,Start_Date:{$lte:currentDate}});
 if(Check_coupon_start == null){
 Couponcode_start_date = false;
  message_status = "You can't use this coupon code at this time, Please Enter any other Coupon Code";
 }
 if( Couponcode_start_date == false ||  Couponcode_expiry_date == false || couponcode_validation == false){
   res.json({Status:"Failed",Message:message_status, Data :{} ,Code:300});
 }else{
   if(Check_coupon_code.Coupon_For == "all"){
      var CouponfinalData = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code}).select('Value_Type Value -_id Amount');
    var CouponUsage = await MechanicbookingModel.find({Customer_id:req.body.Customer_id,Coupon_Code:req.body.Coupon_Code}).count();
    console.log(CouponUsage);
   if(CouponUsage <= Check_coupon_code.Count){
     if(CouponfinalData.Value_Type == "Percentage"){
      if(CouponfinalData.Amount > req.body.Amount){
var number = +CouponfinalData.Amount;
var percentToGet = +CouponfinalData.Value;
var percentAsDecimal = (percentToGet / 100);
var percent = percentAsDecimal * number;
       let datas = {
        "Value_Type": "Amt",
        "Value": percent
       } 
       res.json({Status:"Success",Message:"Coupon validated", Data : datas ,Code:200});
      }else {
     res.json({Status:"Failed",Message:"unable to use this code, you need to purchase above "+req.body.Amount+" Rupees", Data :{} ,Code:300});
      }

     }else{
      res.json({Status:"Success",Message:"Coupon validated", Data : CouponfinalData ,Code:200});
     }
     
   }
   else{
    res.json({Status:"Failed",Message:"Coupon excceeded the count", Data :{} ,Code:300});
   }
 }else{
    var CustomerCoupons = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code, Customer_id:{ $in: req.body.Customer_id}});
     if(CustomerCoupons == null){
      res.json({Status:"Failed",Message:"This Coupon is not applicable for you", Data :{} ,Code:300});
     }
     else{
        var CouponfinalData = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code}).select('Value_Type Value -_id Amount');
    var CouponUsage = await MechanicbookingModel.find({Customer_id:req.body.Customer_id,Coupon_Code:req.body.Coupon_Code}).count();
    console.log(CouponUsage);
   if(CouponUsage <= Check_coupon_code.Count){
    if(CouponfinalData.Value_Type == "Percentage"){
      if(CouponfinalData.Amount > req.body.Amount){
var number = +CouponfinalData.Amount;
var percentToGet = +CouponfinalData.Value;
var percentAsDecimal = (percentToGet / 100);
var percent = percentAsDecimal * number;
       let datas = {
        "Value_Type": "Amt",
        "Value": percent
       } 
       res.json({Status:"Success",Message:"Coupon validated", Data : datas ,Code:200});
      }else {
     res.json({Status:"Failed",Message:"unable to use this code, you need to purchase above "+req.body.Amount+" Rupees", Data :{} ,Code:300});
      }

     }else{
      res.json({Status:"Success",Message:"Coupon validated", Data : CouponfinalData ,Code:200});
     }
     // res.json({Status:"Success",Message:"Coupon validated", Data : CouponfinalData ,Code:200});
   }
   else{
    res.json({Status:"Failed",Message:"Coupon excceeded the count", Data :{} ,Code:300});
   }
     }
 }
 }

   // var Couponcheck = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code});
   //  if(Couponcheck == null){
   //    res.json({Status:"Failed",Message:"Invalid Coupon", Data :{} ,Code:300});
   // }
   // if(Couponcheck.Coupon_For == "ALL"){
   //  var CouponDetails = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code,Expiry_Date:{$gte:currentDate}});
   //  console.log("CouponDetails",CouponDetails )
   // if(CouponDetails == null){
   //   res.json({Status:"Failed",Message:"Coupon Code Expired", Data :{} ,Code:300});
   // }
   // else{
   //  var CouponfinalData = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code}).select('Value_Type Value -_id');
   //  var CouponUsage = await MechanicbookingModel.find({Customer_id:req.body.Customer_id,Coupon_Code:req.body.Coupon_Code}).count();
   //  console.log(CouponUsage);
   // if(CouponUsage <= Couponcheck.Count){
   //   res.json({Status:"Success",Message:"Coupon validated", Data : CouponfinalData ,Code:200});
   // }
   // else{
   //  res.json({Status:"Failed",Message:"Coupon excceeded the count", Data :{} ,Code:200});
   // }
   // }
   // }
   // else 
   // {
   //  var CouponDetails = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code,Expiry_Date:{$gte:currentDate}});
   //  console.log("CouponDetails",CouponDetails )
   // if(CouponDetails == null){
   //   res.json({Status:"Failed",Message:"Coupon Code Expired", Data :{} ,Code:300});
   // }
   // else{
   //   var CustomerCoupons = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code, Customer_id:{ $in: req.body.Customer_id}});
   //   if(CustomerCoupons == null){
   //    res.json({Status:"Failed",Message:"This Coupon is not applicable for you", Data :{} ,Code:300});
   //   }
   //   else{
   //      var CouponfinalData = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code}).select('Value_Type Value -_id');
   //  var CouponUsage = await MechanicbookingModel.find({Customer_id:req.body.Customer_id,Coupon_Code:req.body.Coupon_Code}).count();
   //  console.log(CouponUsage);
   // if(CouponUsage <= Couponcheck.Count){
   //   res.json({Status:"Success",Message:"Coupon validated", Data : CouponfinalData ,Code:200});
   // }
   // else{
   //  res.json({Status:"Failed",Message:"Coupon excceeded the count", Data :{} ,Code:200});
   // }
   //   }
   // }
   // }
});

// router.post('/codevalidation',async function (req, res) {
//   var currentDate = new Date();
//   console.log(currentDate)
//    var Couponcheck = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code});
//    if(Couponcheck == null){
//       res.json({Status:"Failed",Message:"Invalid Coupon", Data :{} ,Code:200});
//    }
//    else{
//      var CouponDetails = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code});
//      console.log("Details.... " , CouponDetails.Expiry_Date,currentDate);
//      console.log(new Date(CouponDetails.Expiry_Date),currentDate);
//      if(new Date(CouponDetails.Expiry_Date) <= currentDate){

//      var CouponUsage = await MechanicbookingModel.find({Customer_id:req.body.Customer_id,Coupon_Code:req.body.Coupon_Code}).count();
//        if(CouponUsage <= Couponcheck.Count){
//      res.json({Status:"Success",Message:"Coupon validated", Data : CouponUsage ,Code:200});
//    }
//    else{
//     res.json({Status:"Failed",Message:"Coupon excceeded the count", Data :{} ,Code:200});
//    }
//      }
//      else{
//        res.json({Status:"Failed",Message:"Coupon Code Expired", Data :{} ,Code:200});
//      }  
//    }
   
// });


router.post('/edit', function (req, res) {
        CouponsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Coupon Updated", Data : UpdatedDetails ,Code:200});
        });
});



router.post('/delete',function (req, res) {
      CouponsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Coupon Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes',function (req, res) {
      CouponsModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Coupons Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;