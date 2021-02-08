var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const randomstring = require('random-string');
var parkingbookingModel = require('./../models/Parkingbooking_NewModel.js');
var Parking_Pricing_NewModel = require('./../models/Parking_Pricing_NewModel.js');
var parking_details_Model = require('./../models/parking_details_Model');
var VehicleModel = require('./../models/VehicleModel');
var VehicletypeModel = require('./../models/VehicletypeModel');

var moment = require('moment'); // require


router.post('/create', async function(req, res) {
    try{
      var Booking_id = randomstring({
      length: 6,
      numeric: true,
      letters: true,
      special: false,
      exclude: ['a', 'b', 'c','d', 'e', 'f','g', 'h', 'i','j', 'k', 'l','m', 'n', 'o','p', 'q', 'r', 's' ,'t','w','x', 'y','z']
});
    var Booking_Start_Date = req.body.Booking_Start_Date;
    var Booking_Start_Time = req.body.Booking_Start_Time;
    var Booking_End_Time = "";
    var Booking_End_Date = "";
   var time = req.body.Booking_Start_Time;
   var hours = Number(time.match(/^(\d+)/)[1]);
   var minutes = Number(time.match(/:(\d+)/)[1]);
   var AMPM = time.match(/\s(.*)$/)[1];
  if(AMPM == "PM" && hours<12) hours = hours+12;
  if(AMPM == "AM" && hours==12) hours = hours-12;
  var sHours = hours.toString();
  var sMinutes = minutes.toString();
  if(hours<10) sHours = "0" + sHours;
  if(minutes<10) sMinutes = "0" + sMinutes;
  Booking_Start_Date = Booking_Start_Date+" "+ sHours + ":" + sMinutes;
  Booking_Start_Time = Booking_Start_Date;
  console.log("format change date...$$$", Booking_Start_Date);
   if(req.body.Pricing_Type=="Hourly")
   {
    var Booking_End_Time = new Date(Booking_Start_Time);
    Booking_End_Time.setHours(Booking_End_Time.getHours()+ +req.body.Hourly_Count);
    console.log("date format of hourly",Booking_End_Time)
   }
  if(req.body.Pricing_Type=="Monthly")
    {
    var Month_Count = req.body.Month_Count;
    var newdate = new Date(Booking_Start_Date);
    console.log("newdate",newdate)
    var Booking_End_Date = new Date(newdate.setMonth(newdate.getMonth()+ +Month_Count));
    var Booking_End_Time = Booking_End_Date;
    //console.log(Booking_End_Date);
        }
   if(req.body.Pricing_Type=="Daily")
   {
    var date = Booking_Start_Date;
    var result = new Date(date);
    console.log(result)
    result.setDate(result.getDate() + +req.body.Day_Count);
    var Booking_End_Date = result;
    var Booking_End_Time = result;
    //console.log("date format of Daily",Booking_End_Time)
   }

    var datajson = {

      "Booking_Id": Booking_id,
      "Slot_Details":req.body.Slot_Details,
      "Extra_Charge": "",
      "Extra_Time": "",
      "Parkingdetails_Id":req.body.Parking_VendorDetails_Id,
      "Vehicle_Type_Id":req.body.Vehicle_Type_Id,
      "Vehicle_Id":req.body.Vehicle_Id,
      "Booking_Start_Date":Booking_Start_Date,
      "Booking_End_Date":Booking_End_Time,
      "Booking_Start_Time":Booking_Start_Time,
      "Booking_End_Time": Booking_End_Time,
      "Customer_Id":req.body.Customer_Id,
      "Total_Amount":req.body.Total_Amount,
      "Pricing_Type":req.body.Pricing_Type,
      "Hourly_Count":req.body.Hourly_Count || 0,
      "Month_Count":req.body.Month_Count || 0,
      "Days_Count":req.body.Day_Count || 0,
      "Booking_Status":req.body.Booking_Status || "",
      "Check_In_Date": new Date(),
      "Check_Out_Date": new Date(),
      // "parking_shop_name": Parkingdetails_Id.parking_details_name,
      // "parking_shop_address": Parkingdetails_Id.parking_details_address,
      // "parking_shop_address_link": Parkingdetails_Id.parking_details_maplink,
      // "Vehicle_details": Parkingdetails_Id.Vehicle_Id,
      "slot_details": req.body.slot_details,
      "distance": req.body.distance,
      "Kms": req.body.Kms,
      "duration_date": req.body.duration_date,
      "couponcode": req.body.couponcode,
      "couponcode_amount": req.body.couponcode_amount
    }
    //var Slotcheck = await parkingbookingModel.find({Parkingdetails_Id:req.body.Parking_VendorDetails_Id,Vehicle_Type_Id:req.body.Vehicle_Type_Id}).select()
    var Bookingcreation = await parkingbookingModel.create(datajson)
    console.log("Booking Create Details",Bookingcreation);

    var Status_Update = await parkingbookingModel.findOneAndUpdate({ Booking_Id:Bookingcreation.Booking_Id},{Booking_Status:"Booked"});
    Booking_End_Date = Booking_End_Time.toISOString().slice(0,10);
        function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
    var Booking_info = await parkingbookingModel.findOne({Booking_Id:Bookingcreation.Booking_Id}).populate('Vehicle_Id Parkingdetails_Id');
    console.log("Booking_info",Booking_info);

console.log(formatAMPM(Booking_End_Time));
        var Converted_time = formatAMPM(Booking_End_Time);
    var Final_Response ={
      "_id" :  Booking_info._id,
      "Booking_Id": Booking_id,
      "Slot_Details":req.body.Slot_Details,
      "Extra_Charge": "",
      "Extra_Time": "",
      "Parkingdetails_Id":req.body.Parking_VendorDetails_Id,
      "Vehicle_Type_Id":req.body.Vehicle_Type_Id,
      "Vehicle_Id":req.body.Vehicle_Id,
      "Booking_Start_Date":req.body.Booking_Start_Date,
      "Booking_End_Date":Booking_End_Date,
      "Booking_Start_Time":req.body.Booking_Start_Time,
      "Booking_End_Time": Converted_time,
      "Customer_Id":req.body.Customer_Id,
      "Total_Amount":req.body.Total_Amount,
      "Pricing_Type":req.body.Pricing_Type,
      "Hourly_Count":req.body.Hourly_Count || 0,
      "Month_Count":req.body.Month_Count || 0,
      "Days_Count":req.body.Day_Count || 0,
      "Booking_Status":req.body.Booking_Status || "",
      "Check_In_Date": new Date(),
      "Check_Out_Date": new Date(),
      "parking_shop_name": Booking_info.Parkingdetails_Id.parking_details_name,
      "parking_shop_address": Booking_info.Parkingdetails_Id.parking_details_address,
      "parking_shop_address_link": Booking_info.Parkingdetails_Id.parking_details_maplink,
      "Vehicle_details": [Booking_info.Vehicle_Id],
      "distance": req.body.distance,
      "Kms": req.body.Kms,
      "duration_date": req.body.duration_date,
      "couponcode": req.body.couponcode,
      "couponcode_amount": req.body.couponcode_amount
    }
    res.json({Status:"Success",Message:"Parking Booking Added successfully", Data : Final_Response ,Code:200}); 
       
  }
catch(e){
  console.log(e,"@@@@@@@@@@@@@@")
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.post('/qr_checkin',async function (req, res) 
{
  try{
  var Current_Date = req.body.Current_Date;
   var Current_Time = req.body.Current_Time;
   var time = Current_Time;
   var hours = Number(time.match(/^(\d+)/)[1]);
   var minutes = Number(time.match(/:(\d+)/)[1]);
   var AMPM = time.match(/\s(.*)$/)[1];
  if(AMPM == "PM" && hours<12) hours = hours+12;
  if(AMPM == "AM" && hours==12) hours = hours-12;
  var sHours = hours.toString();
  var sMinutes = minutes.toString();
  if(hours<10) sHours = "0" + sHours;
  if(minutes<10) sMinutes = "0" + sMinutes;
  Current_Date = Current_Date+" "+ sHours + ":" + sMinutes;
  Current_Time = Current_Date;
  console.log("format change date...$$$", Current_Date);  
  var Booking_Id=req.body.Booking_Id;
  var Updated_Date = new Date(Current_Date);
  console.log("before date",Updated_Date)
  Updated_Date.setMinutes(Updated_Date.getMinutes() + 5);
  console.log(Updated_Date)
  var Bookingdetails = await parkingbookingModel.findOne({Booking_Id:Booking_Id,
    $and:[{ $or:[{ Booking_Start_Time: {$lte :Current_Time }},{Booking_Start_Time : { $lte: Updated_Date } } ] },
        { $or: [ { Booking_End_Time:{$gte:Current_Time}}, { Booking_End_Time : { $gte : Current_Time } } ] }
    ]});
  var Booking_info = await parkingbookingModel.findOne({Booking_Id:Booking_Id});
  var Start_Date_Info = (Booking_info.Booking_Start_Time).toString().slice(0,25)
  console.log(Bookingdetails);
  if (Bookingdetails==null)
  {
     res.json({Status:"Failed",Message:"Your booking starts from" + " " + Start_Date_Info, Data :[],Code:300});
  }
  if(Bookingdetails.Booking_Status=="CheckedIn"){
     res.json({Status:"Sucess",Message:"You have already checked-IN", Data :[],Code:200});
  }
  else
  {
    var Status_Update = await parkingbookingModel.findOneAndUpdate({ Booking_Id:Booking_Id},{Booking_Status:"CheckedIn",Check_In_Date:Current_Date})
    res.json({Status:"Success",Message:"Checked In successfully", Data :Bookingdetails,Code:200});
  }
  }
  catch(e){
     console.log(e)
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
  }
});

router.delete('/deletes', function (req, res) {
      parkingbookingModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:" Deleted successfully", Data : {} ,Code:200});
      });
});
router.post('/qr_checkout',async function (req, res) 
{
try{
var Booking_Id=req.body.Booking_Id;
var Requested_Time = req.body.Time;
var Current_Date = req.body.Current_Date;
   var Current_Time = req.body.Current_Time;
   var time = Current_Time;
   var hours = Number(time.match(/^(\d+)/)[1]);
   var minutes = Number(time.match(/:(\d+)/)[1]);
   var AMPM = time.match(/\s(.*)$/)[1];
  if(AMPM == "PM" && hours<12) hours = hours+12;
  if(AMPM == "AM" && hours==12) hours = hours-12;
  var sHours = hours.toString();
  var sMinutes = minutes.toString();
  if(hours<10) sHours = "0" + sHours;
  if(minutes<10) sMinutes = "0" + sMinutes;
  Current_Date = Current_Date+" "+ sHours + ":" + sMinutes;
  Current_Time = Current_Date;
  console.log("format change date...$$$", Current_Date);
var Requested_Date = new Date(Current_Date);
var ExtraCharge_Date = new Date(Requested_Date)
Requested_Date.setMinutes(Requested_Date.getMinutes()-5);

var Bookingdetails = await parkingbookingModel.findOne({Booking_Id:Booking_Id,$and: [
        { $or: [ { Booking_End_Time: { $gte : Requested_Date } }, { Booking_End_Time : { $gte: Requested_Date } } ] },
        { $or: [ { Booking_Start_Time: { $lte : Requested_Date } },{Booking_Start_Time: { $lte : Requested_Date  } } ] }
    ]
});
var Exact_Booking_time = await parkingbookingModel.findOne({Booking_Id:Booking_Id});
console.log("bookingdetails...$$$$..###",Bookingdetails);
var Bookingextracharges = await parkingbookingModel.findOne({Booking_Id:Booking_Id,Booking_End_Time:{$lt:Requested_Date}});
console.log(Bookingextracharges,"bookingdetails");
var diffhours = await parkingbookingModel.aggregate([{$match: {Booking_Id:Booking_Id}},{$project:{diffResult:{$subtract:[ExtraCharge_Date, "$Booking_End_Time"]}}}])
var hours = diffhours[0].diffResult;
var time= (hours / (1000 * 60 * 60)%60).toFixed(2);
var finaltime = Math.round(time);
console.log("diffhours..#####",diffhours)
console.log("round the time", time);

if(Bookingdetails== null){
  // if(Bookingextracharges==null){
  //  res.json({Status:"Failed",Message:"No Booking Found", Data :[],Code:300});
  // }
if(Bookingextracharges.Booking_Status=="Booked")
  {
     res.json({Status:"Failed",Message:"You Haven't checked-IN", Data :[],Code:300});
  }
else if(Bookingextracharges.Booking_Status=="Checked_Out")
  {
     res.json({Status:"Failed",Message:"You Have already checked out", Data :[],Code:300});
  }
else if(Bookingextracharges!=null){
  var Bookingextracharges = await parkingbookingModel.findOne({Booking_Id:Booking_Id,Booking_End_Time:{$lt:Requested_Date}});
console.log(Bookingextracharges,"bookingdetails");
  var Hours_Pay = await Parking_Pricing_NewModel.findOne({Parking_VendorDetails_Id:Bookingextracharges.Parkingdetails_Id,Pricing_Type:Bookingextracharges.Pricing_Type}).select({Parking_Hours: {$elemMatch: {To_hr: { $gte:finaltime}}}})
   console.log(Hours_Pay,"##############");
   var Final_Cost = (Hours_Pay.Parking_Hours[0].pay);
   var Status_Update = await parkingbookingModel.findOneAndUpdate({ Booking_Id:Booking_Id},{Booking_Status:"Checked_Out",Booking_End_Time:Requested_Date,Extra_Time:time,Extra_Charge:Final_Cost,Check_Out_Date:Requested_Date},{new: true })
   res.json({Status:"Success",Message:"You have checked_out successfully", Data :{Extra_Charge:Final_Cost,Extra_Time:time},Code:300});
  }
else{ 
  res.json({Status:"Failed",Message:"No Booking Found", Data :[],Code:300});
  }
  }
  else if(Bookingdetails.Booking_Status=="Booked")
  {
     res.json({Status:"Failed",Message:"You Haven't checked-IN", Data :[],Code:300});
  }
else if (Bookingdetails.Booking_Status=="Checked_Out")
  {
     res.json({Status:"Failed",Message:"You Have already checked out", Data :[],Code:300});
  }
  else
  {
     var Status_Update1 = await parkingbookingModel.findOneAndUpdate({Booking_Id:Booking_Id},{Booking_Status:"Checked_Out",Booking_End_Time:ExtraCharge_Date,Check_Out_Date:Requested_Date},{new:true});
    res.json({Status:"Success",Message:"Booking closed successfully", Data :Status_Update1,Code:200});
  }   
}
catch(e){
      console.log(e)
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}  

});


router.post('/bookinghistory',async function (req, res) {
 try
 {
  var Customer_Id=req.body.Customer_Id;
  var arr=[];
  var Requested_Time = req.body.Time;
var Current_Date = req.body.Current_Date;
   var Current_Time = req.body.Current_Time;
   var time = Current_Time;
   var hours = Number(time.match(/^(\d+)/)[1]);
   var minutes = Number(time.match(/:(\d+)/)[1]);
   var AMPM = time.match(/\s(.*)$/)[1];
  if(AMPM == "PM" && hours<12) hours = hours+12;
  if(AMPM == "AM" && hours==12) hours = hours-12;
  var sHours = hours.toString();
  var sMinutes = minutes.toString();
  if(hours<10) sHours = "0" + sHours;
  if(minutes<10) sMinutes = "0" + sMinutes;
  Current_Date = Current_Date+" "+ sHours + ":" + sMinutes;
  Current_Time = Current_Date;
  console.log("format change date...$$$", Current_Date);
  var Updated_Date = new Date(Current_Date);
  var Status_Update = await parkingbookingModel.updateMany({Customer_Id:Customer_Id,Booking_Status:{$ne:"CheckedIn"},Booking_End_Time:{$lte:Updated_Date}},{Booking_Status:"Expired"},{ new: true });
  console.log(Status_Update)
  var Bookinglist = await parkingbookingModel.find({Customer_Id:Customer_Id});
  if(Bookinglist==""){
    res.json({Status:"Failed",Message:"No Bookings Found", Data :[],Code:300}); 
  }
  else
  {
  function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
    for(var i=0;i<Bookinglist.length;i++){
      var Booking_Start_Date = Bookinglist[i].Booking_Start_Date;
      Booking_Start_Date = Booking_Start_Date.toISOString().slice(0,10);
      var Booking_Start_Time = formatAMPM(Bookinglist[i].Booking_Start_Date);
      var Booking_End_Date = Bookinglist[i].Booking_End_Date;
      console.log(Booking_End_Date)
      Booking_End_Date = Booking_End_Date.toISOString().slice(0,10);
      var Booking_End_Time = formatAMPM(Bookinglist[i].Booking_End_Time);
      var Final_Response = {
             "_id": Bookinglist[i]._id,
            "Booking_Id": Bookinglist[i].Booking_Id,
            "Slot_Details": "",
            "Extra_Charge": "",
            "Extra_Time": "",
            "Parkingdetails_Id": Bookinglist[i].Parkingdetails_Id,
            "Vehicle_Type_Id": Bookinglist[i].Vehicle_Type_Id,
            "Vehicle_Id": Bookinglist[i].Vehicle_Id,
            "Booking_Start_Date": Booking_Start_Date,
            "Booking_End_Date": Booking_End_Date,
            "Booking_Start_Time":Booking_Start_Time,
            "Booking_End_Time": Booking_End_Time,
            "Customer_Id":Bookinglist[i].Customer_Id,
            "Total_Amount": Bookinglist[i].Total_Amount,
            "Pricing_Type":Bookinglist[i].Pricing_Type,
            "Hourly_Count": Bookinglist[i].Hourly_Count,
            "Month_Count": Bookinglist[i].Month_Count,
            "Days_Count": Bookinglist[i].Days_Count,
            "Booking_Status": Bookinglist[i].Booking_Status,
      }
      arr.push(Final_Response)
    }
  res.json({Status:"Success",Message:"Booking History", Data :arr,Code:200});  
  }
 
 } 
  catch(e){
      console.log(e)
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
  }
})

module.exports = router;

