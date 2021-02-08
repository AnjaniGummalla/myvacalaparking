var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const randomstring = require('random-string');
var parkingbookingModel = require('./../models/parkingbookingModel');
var parking_details_Model = require('./../models/parking_details_Model');
var VehicleModel = require('./../models/VehicleModel');
var VehicletypeModel = require('./../models/VehicletypeModel');

router.post('/create', async function(req, res) {
   var Booking_id = randomstring({
      length: 6,
      numeric: true,
      letters: true,
      special: false,
      exclude: ['a', 'b', 'c','d', 'e', 'f','g', 'h', 'i','j', 'k', 'l','m', 'n', 'o','p', 'q', 'r', 's' ,'t','w','x', 'y','z']
});
  try{

            var slotdetailss = req.body.slot_details.split("/");
            console.log(slotdetailss);
            var parkingdetails_data = await parking_details_Model.findOne({_id:req.body.parkingdetails_id});
            var Vehicles_data = await VehicleModel.find({_id:req.body.Vehicle_id});
            console.log(parkingdetails_data,Vehicles_data);

        await parkingbookingModel.create({
            ///Mobile input/////
            parkingdetails : req.body.parkingdetails_id,
            slot_details : req.body.slot_details,
            parkingdetails_id: req.body.parkingdetails_id,
            Vehicle_type_id : req.body.Vehicle_type_id,
            Vehicle_id: req.body.Vehicle_id,
            Vehicle_details: req.body.Vehicle_id,
            booking_start_date : req.body.booking_start_date,
            booking_end_date : req.body.booking_end_date,
            booking_start_time : req.body.booking_start_time,
            booking_end_time : req.body.booking_end_time,
            total_amount : req.body.total_amount,
            total_hrs : req.body.total_hrs,
            Booked_Date_and_Time : req.body.Booked_Date_and_Time,
            Customer_id : req.body.Customer_id,
            Price_Details : req.body.Price_Details,
            Booking_id : "Bk-"+Booking_id,
            additional_booking_hrs : "",
            additonal_booking_amount : "",
            Overall_time_duraion : "",
            Overall_amount_paid : "",  
            Booking_status : "Upcoming",
            Checking_date : "",
            Checking_time : "",
            Checkout_date : "",
            Checkout_time : "",
            total_checking_duration : 0 ,
            attach_pic : "" ,
            duration_date  : req.body.duration_date,
            couponcode : req.body.couponcode,
            couponcode_amount : req.body.couponcode_amount,
            Original_amount : req.body.Original_amount,
            admin_status_update_time : "",
            last_admin_update_status :  "Upcoming",
            //////////////Mobile///////
            distance : req.body.distance,
            Kms : req.body.Kms,
            parking_shop_name : parkingdetails_data.parking_details_name,
            parking_shop_address : parkingdetails_data.parking_details_address,
            parking_shop_address_link : parkingdetails_data.parking_details_maplink,
            amount : req.body.total_amount,
            floor : slotdetailss[0] || "",
            block : slotdetailss[1] || "",
            slot : slotdetailss[2] || "",
        }, 
        function (err, user) {
          console.log(user)
          let a  = {
            parking_shop_name : parkingdetails_data.parking_details_name,
            parking_shop_address : parkingdetails_data.parking_details_address,
            parking_shop_address_link : parkingdetails_data.parking_details_maplink,
            Booking_id : "Bk-"+Booking_id,
            Vehicle_details : Vehicles_data,
            amount : req.body.total_amount,
            slot_details : req.body.slot_details,
            Booking_start_date : req.body.booking_start_date,
            Booking_start_time : req.body.booking_start_time,
            Booking_end_date : req.body.booking_end_date,
            Booking_end_time : req.body.booking_end_time,
            Total_hours : req.body.total_hrs,
            distance : req.body.distance,
            Kms :  req.body.Kms,
            duration_date : req.body.duration_date,
            _id : user._id,
            couponcode_amount : req.body.couponcode_amount            
          }
        res.json({Status:"Success",Message:"Parking Booking Added successfully", Data : a ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.get('/deletes', function (req, res) {
      parkingbookingModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Parking Booking Deleted all", Data : {} ,Code:200});     
      });
});




router.post('/getlist_vendor_id', function (req, res) {
        parkingbookingModel.find({parkingdetails_id:req.body.parkingdetails_id}, function (err, StateList) {
           console.log(StateList);
          res.json({Status:"Success",Message:"Parking Booking List", Data : StateList ,Code:200});

        }).populate("parkingdetails Vehicle_type_id Vehicle_id Customer_id");
});









router.post('/checking_entry',async function (req, res) {
  console.log(req.body);
var current_date = req.body.Cur_date+" "+req.body.Cur_time;
current_date = new Date(current_date);
      var Service_listss = await parkingbookingModel.find({});
      var Service_list = await parkingbookingModel.findOne({parkingdetails_id:req.body.parkingdetails_id,Booking_id:req.body.Booking_id,booking_start_date:req.body.Cur_date,Customer_id:req.body.Customer_id});
      if(Service_list == null){
        res.json({Status:"Failed",Message:"You don't have the booking in this Date", Data : {} ,Code:300});
      }else{
        if(Service_list.Booking_status == "Check-in"){
           res.json({Status:"Failed",Message:"You are already Checked in", Data : {} ,Code:300});
        }else{
let a1 = Service_list.booking_start_date+" "+Service_list.booking_start_time;
let b1 = Service_list.booking_end_date+" "+Service_list.booking_end_time;
var date11 = new Date(a1);
var date21 = new Date(b1);

console.log(current_date,date11,date21);
       if(date11 <= current_date){

         if(date21 >= current_date){
                         let dt =  {
            Booking_status : "Check-in",
            Checking_date : req.body.Cur_date_time,
            Checking_time : req.body.Cur_date_time,
         }
         var customerdatalocationstatus = await parkingbookingModel.findByIdAndUpdate({_id:Service_list._id},dt,{new: true});
          // console.log(customerdatalocationstatus);
          res.json({"Status": "Success","Message": "Checking successfully","Data": {},"Code": 200});
         }else{
          res.json({Status:"Failed",Message:"Your booking has closed at "+Service_list.booking_end_time, Data : {} ,Code:300});
         }
      }else{
        res.json({Status:"Failed",Message:"Your booking have not started, it will start at "+Service_list.booking_start_time+". Please re-scan on that time", Data : {} ,Code:300});
      }
    }
      }
});





// router.post('/checking_exit',async function (req, res) {
//       var Service_list = await parkingbookingModel.findOne({parkingdetails_id:req.body.parkingdetails_id,Booking_id:req.body.Booking_id,booking_start_date:req.body.Cur_date,Customer_id:req.body.Customer_id});
//       console.log(Service_list);
//       if(Service_list == null){
//         res.json({Status:"Failed",Message:"You don't have the booking in this Date", Data : {} ,Code:300});
//       }else{
//         if(Service_list.Booking_status == "Upcoming"){
//            res.json({Status:"Failed",Message:"You are not Check-in, Please Check-in and re-scan", Data : {} ,Code:300});
//         }if(Service_list.Booking_status == "Check-out"){
//            res.json({Status:"Failed",Message:"your already Check-out", Data : {} ,Code:300});
//         }
//         else{
//          if(Service_list.booking_end_time >= req.body.Cur_time){
//           let dt =  {
//             Booking_status : "Check-out",
//             Checkout_date : req.body.Cur_date_time,
//             Checkout_time : req.body.Cur_date_time,
//          }
//          var customerdatalocationstatus = await parkingbookingModel.findByIdAndUpdate({_id:Service_list._id},dt,{new: true});
//           res.json({"Status": "Success","Message": "Checkout successfully","Data": {},"Code": 200});
//          }else{
//            // console.log("you have stayed more then the parking tinme");
//            //    var hrs = Cur_time - Service_list.booking_end_time;
//            //    console.log(hrs);
//            //    var parkingdetails_data = await parking_details_Model.findOne({_id:req.body.parkingdetails_id});
//            //    var vehicle_type = await VehicletypeModel.findOne({_id:Service_list.Vehicle_type_id});
//            //    vehicle_type = vehicle_type.Vehicle_Type;
//            //    if()
//            res.json({"Status": "Success","Message": "Time extended need to pay additional amount","Data": {},"Code": 200});


//          }
//         }
//       }
// });




router.post('/checking_exit',async function (req, res) {

  var current_date = req.body.Cur_date+" "+req.body.Cur_time;
  current_date = new Date(current_date);

      var Service_list = await parkingbookingModel.findOne({parkingdetails_id:req.body.parkingdetails_id,Booking_id:req.body.Booking_id,Customer_id:req.body.Customer_id});
      if(Service_list == null){
        res.json({Status:"Failed",Message:"You don't have the booking in this Date",time_extancsion: false, Data : {} ,Code:300});
      }else{
        if(Service_list.Booking_status == "Upcoming"){
           res.json({Status:"Failed",Message:"You are not Check-in, Please Check-in and re-scan",time_extancsion: false, Data : {} ,Code:300});
        }
        if(Service_list.Booking_status == "Check-out"){
           res.json({Status:"Failed",Message:"your already Check-out", Data : {} ,Code:300});
        }
        else{

let a1 = Service_list.booking_start_date+" "+Service_list.booking_start_time;
let b1 = Service_list.booking_end_date+" "+Service_list.booking_end_time;
var date11 = new Date(a1);
var date21 = new Date(b1);


         if(date21 >= current_date){
          let dt =  {
            Booking_status : "Check-out",
            Checkout_date : req.body.Cur_date_time,
            Checkout_time : req.body.Cur_date_time,
         }
         var customerdatalocationstatus = await parkingbookingModel.findByIdAndUpdate({_id:Service_list._id},dt,{new: true});
          res.json({"Status": "Success","Message": "Checkout successfully",time_extancsion: false,"Data": {},"Code": 200});

         }
         else
         {
let a = Service_list.booking_end_date+" "+Service_list.booking_end_time;
let b = req.body.Cur_date+" "+req.body.Cur_time;

console.log(a,b);
   var spacecheck = a.split(" ");
   var timecheck = spacecheck[0].split(":");
   if(spacecheck[1] == "PM"){
    if(timecheck[0] == 12){
     timecheck[0] = +timecheck[0];
    }else{
      timecheck[0] = +timecheck[0]+12;
    }
         
   }
   var spacecheck1 = b.split(" ");
   var timecheck1 = spacecheck1[0].split(":");
   if(spacecheck1[1] == "PM"){
    if(timecheck1[0] == 12){
     timecheck1[0] = +timecheck1[0];
    }else{
      timecheck1[0] = +timecheck1[0]+12;
    }
         // timecheck1[0] = +timecheck1[0]+12
   }
   let end_time_24 = timecheck1[0];
   let start_time_24 = timecheck[0];

 var start_date = Service_list.booking_end_date; //mm/dd/yyyy
 var end_date = req.body.Cur_date;
 var start_time = +start_time_24;
 var end_time = +end_time_24;
 var datestring = start_date;
var Parking_booking_detailss = await parkingbookingModel.findOne({_id:Service_list._id});
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var d =  new Date(datestring);
var dayName = days[d.getDay()];
var dayindex = d.getDay();
console.log('dayIndie',dayindex);
 var Parking_booking_details = await parking_details_Model.findOne({_id:req.body.parkingdetails_id});
 var vehicle_type = await VehicletypeModel.findOne({_id:Parking_booking_detailss.Vehicle_type_id});
 var vehicle_type = vehicle_type.Vehicle_Type;
 ////Bike Normal Working Days Prices Fetching//////
 if(vehicle_type == "Two Wheeler"){
  var times_details = Parking_booking_details.parking_details_bike_price_day[dayindex].Timings;
  var total_time_count = Parking_booking_details.parking_details_bike_price_day[dayindex].Timings.length;
  if(total_time_count == 0){
    res.json({Status:"Failed",Message:"Slot not available at time", Data : {} ,Code:404});
  }
else{
  var daytime_start_at = Parking_booking_details.parking_details_bike_price_day[dayindex].Timings[0].Start_time;
  var daytime_end_at = Parking_booking_details.parking_details_bike_price_day[dayindex].Timings[total_time_count - 1].End_time;
   var check_start = 0 ;
   var check_end = 0 ;
   if(+daytime_start_at <= +start_time){
    check_start = 1 ;
   }
   if(+daytime_end_at >= +end_time){
    check_end = 1 ;
   }
   if(check_end == 1 && check_start == 1){
       hours_count = end_time - start_time;
       times = 0 ;
       times_detailss = [];
       prices = 0 ;
        for(let h = 0 ; h < hours_count; h ++){
            if(h == 0){
              times = start_time;
                    for(let t = 0 ; t < times_details.length ; t ++){
                           if(times_details[t].Start_time <= times && times_details[t].End_time >= times){
                             let co = {
                              "date": dayName,
                              "start_time": times_details[t].Start_time,
                              "end_time": times_details[t].End_time,
                              "prices": times_details[t].Price
                               }
                              times_detailss.push(co);
                              prices = prices + times_details[t].Price;
                           }
                    }
            }else {
               times = times + 1
                 for(let t = 0 ; t < times_details.length ; t ++){
                           if(times_details[t].Start_time <= times && times_details[t].End_time >= times){
                              let co = {
                              "date": dayName,
                              "start_time": times_details[t].Start_time,
                              "end_time": times_details[t].End_time,
                              "prices": times_details[t].Price
                               }
                              times_detailss.push(co);
                              prices = prices + times_details[t].Price;
                           }
                    }
            }
            if(h == hours_count - 1){
 
            
let g = req.body.start_date+" "+req.body.start_time;
let h = req.body.end_date+" "+req.body.end_time;
var date1 = new Date(g);
var date2 = new Date(h);
var msDifference = date2.getTime() - date1.getTime();
let minutesss = Math.floor(msDifference/1000/60);
var hrs = timeConvert(minutesss);
function timeConvert(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return  rhours;
}


let i = Parking_booking_detailss.booking_start_date+" "+Parking_booking_detailss.booking_start_time;
let j = req.body.end_date+" "+req.body.end_time;
var date1 = new Date(i);
var date2 = new Date(j);
var msDifferences = date2.getTime() - date1.getTime();
let minutessss = Math.floor(msDifferences/1000/60);
var ov_all = timeConvert(minutessss);
      let a = {
      start_time : Parking_booking_detailss.booking_start_time,
      start_date : Parking_booking_detailss.booking_start_date,
      end_time : req.body.end_time,
      end_date : req.body.end_date,
      Price_Details  : times_detailss,
      total_price : prices,
      final_total : prices + Parking_booking_detailss.total_amount,
      already_pay : Parking_booking_detailss.total_amount,
      booking_id : Parking_booking_detailss._id,
      additional_booking_hrs : hrs,
      additonal_booking_amount : prices,
      Overall_time_duraion : ov_all,
      Overall_amount_paid : prices + Parking_booking_detailss.total_amount, 
      extra_time : hrs,
      Booking_status : Parking_booking_detailss.Booking_status
      }
      res.json({Status:"Success",Message:"Available",time_extancsion: true , Data : a ,Code:200});
      }
      }
   }else{
     res.json({Status:"Failed",Message:"Slot not available at time", Data : {} ,Code:404});
   }

 }
 }
 ////Car Normal Working Days Prices Fetching//////
 if(vehicle_type == "Four Wheeler"){
   console.log(dayindex);
  console.log(Parking_booking_details);
  var times_details = Parking_booking_details.parking_details_car_price_day[dayindex].Timings;
  var total_time_count = Parking_booking_details.parking_details_car_price_day[dayindex].Timings.length;
   if(total_time_count == 0){
    res.json({Status:"Failed",Message:"Slot not available at time", Data : {} ,Code:404});
  }
  else{
  var daytime_start_at = Parking_booking_details.parking_details_car_price_day[dayindex].Timings[0].Start_time;
  var daytime_end_at = Parking_booking_details.parking_details_car_price_day[dayindex].Timings[total_time_count - 1].End_time;
  
   var check_start = 0 ;
   var check_end = 0 ;
  
   if(+daytime_start_at <= +start_time){
    
    check_start = 1 ;
   }
   if(+daytime_end_at >= +end_time){
    check_end = 1 ;
   }
   console.log(check_end,check_start);
   if(check_end == 1 && check_start == 1){
       hours_count = end_time - start_time;
       times = 0 ;
       times_detailss = [];
       prices = 0 ;
     
        for(let h = 0 ; h < hours_count; h ++){
            if(h == 0){
              times = start_time;
               
                    for(let t = 0 ; t < times_details.length ; t ++){
                           if(times_details[t].Start_time <= times && times_details[t].End_time >= times){
                             let co = {
                              "date": dayName,
                              "start_time": times_details[t].Start_time,
                              "end_time": times_details[t].End_time,
                              "prices": times_details[t].Price
                               }
                              times_detailss.push(co);
                              prices = prices + times_details[t].Price;
                           }
                    }
            }else {
               times = times + 1
                 for(let t = 0 ; t < times_details.length ; t ++){
                           if(times_details[t].Start_time <= times && times_details[t].End_time >= times){
                              let co = {
                              "date": dayName,
                              "start_time": times_details[t].Start_time,
                              "end_time": times_details[t].End_time,
                              "prices": times_details[t].Price
                               }
                              times_detailss.push(co);
                              prices = prices + times_details[t].Price;
                           }
                    }
            }
            if(h == hours_count - 1){



let g = req.body.start_date+" "+req.body.start_time;
let h = req.body.end_date+" "+req.body.end_time;
var date1 = new Date(g);
var date2 = new Date(h);
var msDifference = date2.getTime() - date1.getTime();
let minutesss = Math.floor(msDifference/1000/60);
var hrs = timeConvert(minutesss);
function timeConvert(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return  rhours ;
}


let i = Parking_booking_detailss.booking_start_date+" "+Parking_booking_detailss.booking_start_time;
let j = req.body.end_date+" "+req.body.end_time;
var date1 = new Date(i);
var date2 = new Date(j);
var msDifferences = date2.getTime() - date1.getTime();
let minutessss = Math.floor(msDifferences/1000/60);
var ov_all = timeConvert(minutessss);
      let a = {
      start_time : Parking_booking_detailss.booking_start_time,
      start_date : Parking_booking_detailss.booking_start_date,
      end_time : req.body.end_time,
      end_date : req.body.end_date,
      Price_Details  : times_detailss,
      total_price : prices,
      final_total : prices + Parking_booking_detailss.total_amount,
      already_pay : Parking_booking_detailss.total_amount,
      booking_id : Parking_booking_detailss._id,
      additional_booking_hrs : hrs,
      additonal_booking_amount : prices,
      Overall_time_duraion : ov_all,
      Overall_amount_paid : prices + Parking_booking_detailss.total_amount, 
      extra_time : hrs,
      Booking_status : Parking_booking_detailss.Booking_status
      }
      res.json({Status:"Success",Message:"Available",time_extancsion: true , Data : a ,Code:200});
      // res.json({Status:"Success",Message:"Available", Data : a ,Code:200});
      }
      }
   }
   else{
     res.json({Status:"Failed",Message:"Slot not available at time", Data : {} ,Code:404});
   }
 }
 }
         }
        }
      }
});



router.post('/additional_hrs_crs',async function (req, res) {

   console.log(req.body);

    var Parking_booking_details = await parking_details_Model.findOne({_id:req.body.booking_id});
    console.log(Parking_booking_details);
        let data = {
            duration_date : req.body.duration_date,
            booking_start_date : req.body.start_date,
            booking_end_date : req.body.end_date,
            booking_start_time : req.body.start_time,
            booking_end_time : req.body.end_time,
      Price_Details  : req.body.Price_Details,
      total_price : req.body.total_price,
      final_total : req.body.Overall_amount_paid,
      already_pay : req.body.already_pay,
      booking_id : req.body.booking_id,
      additional_booking_hrs : req.body.additional_booking_hrs,
      additonal_booking_amount : req.body.additonal_booking_amount,
      Overall_time_duraion : req.body.Overall_time_duraion,
      Overall_amount_paid :req.body.Overall_amount_paid,
      extra_time : req.body.extra_time,
      Booking_status : req.body.Booking_status,
      total_amount : req.body.Overall_amount_paid,
      total_hrs : req.body.Overall_time_duraion,
        }
     parkingbookingModel.findByIdAndUpdate(req.body.booking_id, data, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Updated successfully", Data : UpdatedDetails ,Code:200});
        }).populate('Vehicle_details');
});

router.post('/getlist_id', function (req, res) {
  console.log(req.body);
        parkingbookingModel.find({Customer_id:req.body.Customer_id}, function (err, StateList) {
          console.log(StateList);
           if(StateList.length == 0){
             res.json({Status:"Success",Message:"Parking Booking List", Data : [] ,Code:200});
           }else{
            for(let a = 0 ; a < StateList.length ; a ++){
             current_Date = new Date(req.body.date_time);
             End_Date = new Date(StateList[a].booking_end_date+' '+StateList[a].booking_end_time);
             if(current_Date > End_Date){
              if(StateList[a].Booking_status == 'Upcoming'){
              StateList[a].Booking_status = 'Closed';
              console.log(End_Date);
              }
             }
             if(a == StateList.length - 1){
              res.json({Status:"Success",Message:"Parking Booking List", Data : StateList ,Code:200});
            }
            }

          }
        }).populate('Vehicle_details');
});

router.get('/getlist', function (req, res) {
        parkingbookingModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Parking Booking", Data : Functiondetails ,Code:200});
        }).populate('Customer_id Vehicle_details Vehicle_type_id');
});

router.post('/edit', function (req, res) {
        parkingbookingModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Parking Booking Updated", Data : UpdatedDetails ,Code:200});
        });
});


// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      parkingbookingModel.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Parking Booking Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;

