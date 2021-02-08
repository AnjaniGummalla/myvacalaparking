var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var MechanicbookingModel = require('./../models/MechanicbookingModel');
var CouponsModel = require('./../models/CouponsModel');
const randomstring = require('random-string');
var VerifyToken = require('./VerifyToken');
var CartModel = require('./../models/CartModel');
const { check, validationResult } = require('express-validator');
const excel = require('exceljs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const moment = require('moment');
let BaseUrl = "http://3.101.31.129:3000";
var ServiceModel = require('./../models/ServiceModel');

router.post('/create', [
    //check('Customer_Name').not().isEmpty().exists({ checkFalsy: true }).withMessage("Not a valid Name"),
    //check('Customer_Phone').not().isEmpty().isLength({ min: 10 }).isDecimal().withMessage("Please upload a Image"),
    //check('Customer_Email').not().isEmpty().withMessage("Please provide valid Description"),
    //check('Services').not().isEmpty().withMessage("Please select the service"),
    //check('Vehicle_Id').not().isEmpty().withMessage("Please select the Vehicle"),
  ], async function(req, res) {
    var Service_list = await ServiceModel.find({});
    // console.log(Service_list);
    // console.log("Booking_input",req.body.card_details);
    let card_Details = req.body.card_details;
    var Sercvice_name = "";
    var Subservice_name = "";
    for(let b = 0 ; b < card_Details.length ; b ++){
      for(let a  = 0  ; a < Service_list.length ; a ++){
        // console.log(card_Details[b].Service_id,Service_list[a].Service_Name);
      if(""+card_Details[b].Service_id == ""+Service_list[a]._id){
        if(b==0){
        Sercvice_name =  Service_list[a].Service_Name;
        Subservice_name = card_Details[b].sub_ser_Title;
        }else{
        Sercvice_name = Sercvice_name + "," + Service_list[a].Service_Name;
        Subservice_name = Subservice_name + "," + card_Details[b].sub_ser_Title;
        }
      }
    }
  }
  var finals_string = "";
  var string = Sercvice_name.split(",");
  console.log(string); 
  var final_data = [];
  for(let c = 0 ; c < string.length ;  c ++) {
    if(c == 0){
      final_data.push(string[c]);
      finals_string = string[c];
    }else {
      let check = 1 ;
       for(let d = 0 ; d < final_data.length ; d ++){
        if(final_data[d] == string[c]){
          check = 0
        }
        if(d == final_data.length - 1){
          if(check == 1){
            final_data.push(string[c]);
             finals_string = finals_string + "," + string[c];
          }
        }
       }
    }
  }

console.log(final_data);
console.log(finals_string);
console.log(Subservice_name);
         var finalDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss A");
         var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
         let date = new Date();
         const time = moment(date);
         var testime = moment(new Date(indiaTime)).format("DD-MM-YYYY hh:mm:ss A");
  try{
     const errors = validationResult(req);
      // console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
     var Unique_Code = randomstring({length: 10});
     var Booking_id = randomstring({
      length: 12,
      numeric: true,
      letters: true,
      special: false,
      exclude: ['a', 'b', 'c','d', 'e', 'f','g', 'h', 'i','j', 'k', 'l','m', 'n', 'o','p', 'q', 'r', 's' ,'t','w','x', 'y','z']
});
     await MechanicbookingModel.create({
           //Mobile Input //
           Booking_id: Booking_id || "",
           Customer_Name : req.body.Customer_Name || "",
           Customer_id:req.body.Customer_id  || "",
           Customer_Phone : req.body.Customer_Phone  || "",
           Customer_Address : req.body.Customer_Address  || "",
           Customer_Email : req.body.Customer_Email || "",
           Services : finals_string || "",
           Subserivces: Subservice_name || "",
           // Vehicle_Id:req.body.Vehicle_Id || "",
           Vehicle_Type: req.body.Vehicle_Type || "",
           Vehicle_No: req.body.Vehicle_No || "",
           Vehicle_Image: req.body.Vehicle_Image || "",
           Vehicle_Name: req.body.Vehicle_Name || "",
           Lubricant_type:req.body.Lubricant_type || "",
           Lubricant_type_color : req.body.Lubricant_type_color || "",
           Booking_Date:req.body.Booking_Date || "",
           Arrival_Mode:req.body.Arrival_Mode || "",
           Pickup_Date : req.body.Pickup_Date || "",
           Pickup_Time : req.body.Pickup_Time || "",
           Coupon_Code: req.body.Coupon_Code || "",
           Coupon_Code_Prcentage:req.body.Coupon_Code_Percentage || "",
           Coupon_Code_Amount:req.body.Coupon_Code_Amount || "",
           Total_Amount:req.body.Total_Amount || 0,
           Order_Value:req.body.Order_Value || "",
           // Booking_Time:req.body.Booking_Time || "",
           Year_Of_Mfg:req.body.Year_Of_Mfg  || "",
           Booking_Status: "Booking completed",
           card_details : req.body.card_details || "",
           //Admin Input//  

           Final_bill_payed:req.body.Final_bill_payed || "0",
           Customer_Invoice: [] || "",
           Job_Card: [] || "",
           // Vendor_Id : req.body.Vendor_Id || "",
           Workshop_Location:req.body.Workshop_Location || "",
           Workshop_Name: req.body.Workshop_Name || "",
           Status_history_text : [{"title":"Booking completed","date": ""+ testime}] || "",
           Track_order_text : "Booking process is completed" || "",
           Mechanicworkshop_ids : "",
           User_issues : req.body.User_issues,
           Booking_at : req.body.Booking_at,
           // Mechanic_id:req.body.Mechanic_id || "",
           // Delivery_Time : req.body.Delivery_Time || "",
           // // Delivery_Date : ,
           // Mechanic_Name:req.body.Mechanic_Name || "",
           // Mechanic_Phone: 0,
           // Transaction_id:req.body.Transaction_id || "",
           // Token_Status:req.body.Token_Status || "",
           // Vehiclepickup_Status:req.body.Vehiclepickup_Status || "",
           // Vehicledelivery_Status:req.body.Vehicledelivery_Status || "",
           // Vehicleservice_Status: req.body.Vehicleservice_Status || "",
           // OTP:req.body.OTP || "",
           // Vechicle_Pickup_Images: req.body.Vechicle_Pickup_Images || "",
           // Vehicle_Garage_Images: req.body.Vehicle_Garage_Images || "",
           // Unique_Code:req.body.Unique_Code || "",
           // Token_Age:req.body.Token_Age || "",
           // Current_Booking_Status:req.body.Current_Booking_Status || "",
           // TAT: req.body.TAT || "",
           // Pick_Up_Location:req.body.Pick_Up_Location || "",
           // Pick_Up_City:req.body.Pick_Up_City || "",
           // Vendor_Invoice:req.body.Vendor_Invoice || "",
           // Booking_Mode: req.body.Booking_Mode || "",
        }, async function (err, user) {
          console.log(err);
          let data = {
              "Services" : finals_string,
              "Booking_id": Booking_id,
              "Subserivces" : Subservice_name,
              "Vehicle_Details" : req.body.Vehicle_Name,
              "Registration_No" : req.body.Vehicle_No,
              "Service_Date":  req.body.Pickup_Date,
              "Service_Time":  req.body.Pickup_Time,
              "Amount_Paid": req.body.Total_Amount,
              "Transaction_id": req.body.Transaction_id,
              "Coupon_Code_Amount" : req.body.Coupon_Code_Amount,
              "User_issues" : req.body.User_issues
          }
          console.log(user);
           console.log(data);
             console.log(err);
        var type_check = await CartModel.findOne({Customer_id:req.body.Customer_id});
        if(type_check !== null){
        console.log("Cheikakdfa",type_check);
         var deleted = await CartModel.findByIdAndRemove({_id:type_check._id});
        }
        res.json({Status:"Success",Message:"Added successfully", Data : data ,Code:200}); 

    });      
    console.log(req.body);
}
catch(e){
      console.log(e)
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.post('/excel', async function(req,res){
    try{
  var BookingIds = req.body.BookingIds;
  var finallist = [];
  for(var i = 0;i<= BookingIds.length;i++ ){
    var customers = await MechanicbookingModel.findOne({Booking_id: BookingIds[i]});
    finallist.push(customers);
    console.log(finallist)
  }
//var customers = await MechanicbookingModel.find({Booking_id: BookingIds[i]});
  let workbook = new excel.Workbook(); //creating workbook
  let worksheet = workbook.addWorksheet('finallist'); //creating worksheet
  
  //  WorkSheet Header
  worksheet.columns = [
    { header: 'Booking_Id', key: 'Booking_id', width: 20 },
    { header: 'Customername', key: 'Customer_Name', width: 20 },
    { header: 'CPhone', key: 'Customer_Phone', width: 20},
    { header: 'Phone', key: 'Phone', width: 20},
    { header: 'Vehicle_No', key: 'Vehicle_No', width: 20 },
    { header: 'Vehicle_Type', key: 'Vehicle_Type', width: 20 },
    { header: 'Services', key: 'Services', width: 20},
    { header: 'SubServices', key: 'SubServices', width: 20},
    { header: 'Order_value', key: 'Order_value', width: 20 },
    { header: 'Pickup_Location', key: 'Pickup_Location', width: 20 },
    { header: 'Pickup_Date', key: 'Pickup_Date', width: 20},
    { header: 'Pickup_City', key: 'Pickup_City', width: 20},
    { header: 'Delivery_Date', key: 'Delivery_Date', width: 20 },
    { header: 'Booking_Date', key: 'Booking_Date', width: 20 },
    { header: 'Final_Bill_Payed', key: 'Final_Bill_Payed', width: 20},
    { header: 'Workshop_ID', key: 'Workshop_ID', width: 20},
    { header: 'Workshop_Location', key: 'Workshop_Location', width: 20},
    { header: 'Workshop_Name', key: 'Workshop_Name', width: 20 },
    { header: 'Booking_Status', key: 'Booking_Status', width: 20 },
    { header: 'Job_Card', key: 'Job_Card', width: 20},
    { header: 'Vendor_Invoice', key: 'Vendor_Invoice', width: 20},
    { header: 'Customer_Invoice', key: 'Customer_Invoice', width: 20}
  ];
  
  // Add Array Rows
  worksheet.addRows(finallist);
  
  // Write to File
  var filepath =  __dirname +/ExcelDocuments/+ uuidv4() + '.xlsx' ;
  var uploadPath = __dirname + '/public/ExcelDocuments/' +  uuidv4() + '.xlsx' ;
  console.log(filepath)
  await workbook.xlsx.writeFile(uploadPath);
      console.log("file saved!");
       res.json({Status:"Success",Message:"Excel Generated", Data :filepath ,Code:200});
    
}
catch(e){
  console.log(e)
 res.json({Status:"Failed",Message:"Internal Server Error", Data :{},Code:500});
}
  });


router.get('/getlist', function (req, res) {
        MechanicbookingModel.find({}, function (err, Servicebookingdetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicebookingdetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [],Code:404});
           }

            Servicebookingdetails.sort(function compare(a, b) {
              console.log(a.server_date_time);
              console.log(b.server_date_time);
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               console.log(dateA,dateB);
               return dateB - dateA;
               });

          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});




router.post('/finalpayable_update',async function (req, res) {
    var booking_details =  await MechanicbookingModel.findOne({_id:req.body._id});
    booking_details.Total_Amount =  +booking_details.Total_Amount + req.body.Final_bill_payed; 
    var customerdatalocationstatus = await MechanicbookingModel.findByIdAndUpdate({_id:req.body._id},{Final_bill_payed: "0",Total_Amount : booking_details.Total_Amount},{new: true});
    res.json({Status:"Success",Message:"Updated", Data : customerdatalocationstatus ,Code:200});

});



router.post('/bookinghistory', function (req, res) {
        MechanicbookingModel.find({Customer_id:req.body.Customer_id}, function (err, Servicebookingdetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicebookingdetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [],Code:404});
           }
           
              Servicebookingdetails.sort(function compare(a, b) {
               var dateA = new Date(a.createdAt);
               var dateB = new Date(b.createdAt);
               return dateB - dateA;
               });
          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});



router.post('/individuallist', async function (req, res) {
      var Servicebookingdetails =  await MechanicbookingModel.find({Customer_id:req.body.Customer_id}).populate('Vehicle_Id');
          if(Servicebookingdetails == ""){
            var bookingiddetails = await MechanicbookingModel.find({Booking_id:req.body.Booking_id}).populate('Vehicle_Id');
            res.json({Status:"Success",Message:"Servicebookingdetails", Data : bookingiddetails ,Code:200});
          }
          else{
            res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
          }
        });
router.post('/mobile/orderhistory', async function (req, res) {
      var Servicebookingdetails =  await MechanicbookingModel.find({Customer_id:req.body.Customer_id});
          if(Servicebookingdetails == ""){
            var bookingiddetails = await MechanicbookingModel.find({Booking_id:req.body.Booking_id});
            res.json({Status:"Success",Message:"Servicebookingdetails", Data : bookingiddetails ,Code:200});
          }
          else{
            res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
          }
        });
router.post('/locationfliter', async function (req, res) {
      var Servicebookingdetails =  await MechanicbookingModel.find({Pick_Up_City:req.body.Pick_Up_City});
          if(Servicebookingdetails == ""){
            var bookingiddetails = await MechanicbookingModel.find({Pick_Up_Location:req.body.Pick_Up_City});
            res.json({Status:"Success",Message:"Servicebookingdetails", Data : bookingiddetails ,Code:200});
          }
          else{
            res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
          }
        });

router.post('/servicefliter', async function (req, res) {
      var Servicebookingdetails =  await MechanicbookingModel.find({Services:{ $in: req.body.Services}});
          if(Servicebookingdetails == ""){
            res.json({Status:"Failed",Message:"No data found", Data : [] ,Code:200});
          }
          else{
            res.json({Status:"Success",Message:"Servicebookingdetails", Data :Servicebookingdetails ,Code:200});
          }
        });

router.post('/subservicefliter', async function (req, res) {
      var Servicebookingdetails =  await MechanicbookingModel.find({Subserivces:{ $in: req.body.Subserivces}});
          if(Servicebookingdetails == ""){
            res.json({Status:"Failed",Message:"No data found", Data : [] ,Code:200});
          }
          else{
            res.json({Status:"Success",Message:"Servicebookingdetails", Data :Servicebookingdetails ,Code:200});
          }
        });

router.post('/deliverydatefliter', async function (req, res) {
      var Servicebookingdetails =  await MechanicbookingModel.find({Delivery_Date:{ $eq: req.body.Delivery_Date}});
          if(Servicebookingdetails == ""){
            res.json({Status:"Failed",Message:"No data found", Data : [] ,Code:200});
          }
          else{
            res.json({Status:"Success",Message:"Servicebookingdetails", Data :Servicebookingdetails ,Code:200});
          }
        });

router.post('/bookingdatefliter', async function (req, res) {
      var Servicebookingdetails =  await MechanicbookingModel.find({Booking_Date:{ $eq: req.body.Booking_Date}});
          if(Servicebookingdetails == ""){
            res.json({Status:"Failed",Message:"No data found", Data : [] ,Code:200});
          }
          else{
            res.json({Status:"Success",Message:"Servicebookingdetails", Data :Servicebookingdetails ,Code:200});
          }
        });

router.post('/pickupdatefliter', async function (req, res) {
      var Servicebookingdetails =  await MechanicbookingModel.find({Pickup_Date:{ $eq: req.body.Pickup_Date}});
          if(Servicebookingdetails == ""){
            res.json({Status:"Failed",Message:"No data found", Data : [] ,Code:200});
          }
          else{
            res.json({Status:"Success",Message:"Servicebookingdetails", Data :Servicebookingdetails ,Code:200});
          }
        });
router.post('/workshopnamefliter', async function (req, res) {
      var Servicebookingdetails =  await MechanicbookingModel.find({Workshop_Name:{ $eq: req.body.Workshop_Name}});
          if(Servicebookingdetails == ""){
            res.json({Status:"Failed",Message:"No data found", Data : [] ,Code:200});
          }
          else{
            res.json({Status:"Success",Message:"Servicebookingdetails", Data :Servicebookingdetails ,Code:200});
          }
        });
router.post('/workshoplocationfliter', async function (req, res) {
      var Servicebookingdetails =  await MechanicbookingModel.find({Workshop_Location:{ $eq: req.body.Workshop_Location}});
          if(Servicebookingdetails == ""){
            res.json({Status:"Failed",Message:"No data found", Data : [] ,Code:200});
          }
          else{
            res.json({Status:"Success",Message:"Servicebookingdetails", Data :Servicebookingdetails ,Code:200});
          }
        });

router.post('/statusfliter', async function (req, res) {
      var Servicebookingdetails =  await MechanicbookingModel.find({Booking_Status:{ $eq: req.body.Booking_Status}});
          if(Servicebookingdetails == ""){
            res.json({Status:"Failed",Message:"No data found", Data : [] ,Code:200});
          }
          else{
            res.json({Status:"Success",Message:"Servicebookingdetails", Data :Servicebookingdetails ,Code:200});
          }
        });

router.post('/status', async function (req, res) {
       await MechanicbookingModel.findByIdAndUpdate(req.body.Servicebooking_id,req.body, {new: true} ,function (err, Servicebookingdetails) {
          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});

router.post('/edit',async function (req, res) {
var type_check = await MechanicbookingModel.findOne({Booking_id:req.body.Booking_id});
  console.log(type_check);
        MechanicbookingModel.findByIdAndUpdate(type_check._id, req.body, {new: true}, function (err, UpdatedDetails) {
            console.log(err);
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});

           if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data :[] ,Code:404});
           }
             res.json({Status:"Success",Message:"Servicebookingdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      MechanicbookingModel.findByIdAndRemove(req.body.Servicebooking_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Servicebooking Deleted successfully", Data : {} ,Code:200});
      });
});


router.get('/deletes', function (req, res) {
      MechanicbookingModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Mech Booking Details Deleted", Data : {} ,Code:200});
      });
});


// router.post('/codevalidation',async function (req, res) {
//   var currentDate = new Date();
//  currentDate.setHours(0, 0, 0, 0)
//    var Couponcheck = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code});
//    if(Couponcheck == null){
//       res.json({Status:"Failed",Message:"Invalid Coupon", Data :{} ,Code:200});
//    }
//     var CouponDetails = await CouponsModel.findOne({Coupon_Code:req.body.Coupon_Code,Expiry_Date:{$gte:currentDate}});
//     console.log("CouponDetails",CouponDetails )
//    if(CouponDetails == null){
//      res.json({Status:"Failed",Message:"Coupon Code Expired", Data :{} ,Code:200});
//    }
//    else{
//     var CouponUsage = await MechanicbookingModel.find({Customer_id:req.body.Customer_id,Coupon_Code:req.body.Coupon_Code}).count();
//     console.log(CouponUsage);
//    if(CouponUsage <= Couponcheck.Count){
//      res.json({Status:"Success",Message:"Coupon validated", Data : CouponUsage ,Code:200});
//    }
//    else{
//     res.json({Status:"Failed",Message:"Coupon excceeded the count", Data :{} ,Code:200});
//    }
//    }
// });

router.delete('/deletes',  function (req, res) {
      MechanicbookingModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Servicebooking Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;