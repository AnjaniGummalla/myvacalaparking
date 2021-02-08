var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var parking_details_Model = require('./../models/parking_details_Model');
var Parking_owner_Model = require('./../models/parking_owner_Model');
var VehicletypeModel = require('./../models/VehicletypeModel');
var GeoPoint = require('geopoint');
var moment = require('moment'); // require
var QRcodeHelper = require('./QRcodehelper')
var BaseUrl = "http://54.214.141.11:3000"; 
var QRcodeModel = require('./../models/QRcodeModel');
var parkingbookingModel = require('./../models/parkingbookingModel');

router.post('/create', async function(req, res) {
  try{
        await parking_details_Model.create({
                parking_owner_id: req.body.parking_owner_id || "",
                parking_details_name:  req.body.parking_details_name || "",
                parking_details_address : req.body.parking_details_address || "",
                parking_details_gstaddress : req.body.parking_details_gstaddress || "",
                parking_details_gstdoc : req.body.parking_details_gstdoc || "",
                parking_details_gstno : req.body.parking_details_gstno || "",
                parking_details_maplink : req.body.parking_details_maplink || "",
                parking_details_lat : req.body.parking_details_lat || "",
                parking_details_long : req.body.parking_details_long || "",
                parking_details_pocemail : req.body.parking_details_pocemail || "",
                parking_details_slots_Bike_details : req.body.parking_details_slots_Bike_details || "",
                parking_details_slots_Car_details :  req.body.parking_details_slots_Car_details || "",
                ///slot prices//
                parking_details_price_bike_type :  req.body.parking_details_price_bike_type || "",
                parking_details_price_car_type :  req.body.parking_details_price_car_type || "",
                parking_details_price_both_type :  req.body.parking_details_price_both_type || "",
                parking_details_bike_price_day : req.body.parking_details_bike_price_day || "",
                parking_details_bike_price_spe_day : req.body.parking_details_bike_price_spe_day || "",
                parking_details_car_price_day : req.body.parking_details_car_price_day || "",
                parking_details_car_price_spe_day : req.body.parking_details_car_price_spe_day || "",
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Parking Details Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/deletes', function (req, res) {
      parking_details_Model.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Parking Details Deleted all", Data : {} ,Code:200});     
      });
});


// Getparkinglist_with12
////Mobile User API//
router.post('/Getparkinglist_with12', function (req, res) {
///conditions
   var spacecheck = req.body.start_itme.split(" ");
   var timecheck = spacecheck[0].split(":");
   if(spacecheck[1] == "PM"){
         timecheck[0] = +timecheck[0]+12
   }
   var spacecheck1 = req.body.end_time.split(" ");
   var timecheck1 = spacecheck1[0].split(":");
   if(spacecheck1[1] == "PM"){
         timecheck1[0] = +timecheck1[0]+12
   }
   let end_time_24 = timecheck1[0];
   let start_time_24 = timecheck[0];

var datestring = req.body.start_dates;
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var d =  new Date(datestring);
var dayName = days[d.getDay()];
var dayindex = d.getDay();
    parking_details_Model.find({},async function (err, StateList) { 
    var vehicle_type = await VehicletypeModel.findOne({_id:req.body.Vehicletype_id});
    final_location_list = [];
    for(let a  = 0 ; a < StateList.length ; a ++){
    var point1 = new GeoPoint(+req.body.Location_lat, +req.body.Location_long);
    var point2 = new GeoPoint(+StateList[a].parking_details_lat,+StateList[a].parking_details_long);
    var distance = point1.distanceTo(point2, false)//output in kilometers
    StateList[a].parking_distance = distance.toFixed(2);
    var times =  +distance * 1000; 
    StateList[a].parking_reach_time =  times / 3600;
    StateList[a].parking_reach_time  = StateList[a].parking_reach_time.toFixed(2);
    if(distance > 1){
      final_location_list.push(StateList[a]);
    }
  if(a == StateList.length - 1){
     for(let c = 0 ; c < final_location_list.length ; c++){
        if(vehicle_type.Vehicle_Type == "Four Wheeler"){
          var car_special_prices = final_location_list[c].parking_details_car_price_spe_day;
          var car_normal_prices = final_location_list[c].parking_details_car_price_day;
           var special_day = 0;
           for(let b = 0 ; b < car_special_prices.length ; b ++){
                if(car_special_prices[b].dates == req.body.start_dates){
                     var start_hr = car_special_prices[b].Start_time.split(":");
                     var end_hr = car_special_prices[b].End_time.split(":");
                      var start =  +start_hr[0] * 60 + +start_hr[1];
                      var end   = +end_hr[0] * 60 + +end_hr[1];
                      function inTime(){
                        var time = +start_time_24;
                        return time >= start && time < end;
                      }
                      var check_sts = inTime();
                      if(check_sts == true){
                         final_location_list[c].parking_prices == car_special_prices[b].Price;
                         var special_day = 1;
                      }      
                }
             if(b == car_special_prices.length - 1){
                 if(special_day == 0){
                      car_normal_price_time  = car_normal_prices[dayindex].Timings;
                     for(let j = 0 ; j < car_normal_price_time.length; j++){
                     var start_hr = car_normal_price_time[j].Start_time.split(":");
                     var end_hr = car_normal_price_time[j].End_time.split(":");
                      var start =  +start_hr[0] * 60 + +start_hr[1];
                      var end   = +end_hr[0] * 60 + +end_hr[1];
                      function inTime() {
                        var time = +start_time_24;
                        return time >= start && time < end;
                      }
                      var check_sts = inTime();
                      if(check_sts == true){
                         final_location_list[c].parking_prices = car_normal_price_time[j].Price;
                      }
                     }
                 }
             }
           }
        }
        else {
            /////Bike/////
          var bike_special_prices = final_location_list[c].parking_details_bike_price_spe_day;
          var bike_normal_prices = final_location_list[c].parking_details_bike_price_day;
           var special_day = 0;
           for(let b = 0 ; b < bike_special_prices.length ; b ++){
                if(bike_special_prices[b].dates == req.body.start_dates){
                     var start_hr = bike_special_prices[b].Start_time.split(":");
                     var end_hr = bike_special_prices[b].End_time.split(":");
                     var start =  +start_hr[0] * 60 + +start_hr[1];
                     var end   = +end_hr[0] * 60 + +end_hr[1];
                     function inTime() {
                        var time = +start_time_24 * 60 + 0;
                        return time >= start && time < end;
                      }
                      var check_sts = inTime();
                      if(check_sts == true){
                         final_location_list[c].parking_prices = bike_special_prices[b].Price;
                         var special_day = 1;
                      }      
                }
             if(b == bike_special_prices.length - 1){
                 if(special_day == 0){
                      bike_normal_price_time  = bike_normal_prices[dayindex].Timings;
                     for(let j = 0 ; j < bike_normal_price_time.length; j++){
                     var start_hr = bike_normal_price_time[j].Start_time.split(":");
                     var end_hr = bike_normal_price_time[j].End_time.split(":");
                      var start =  +start_hr[0] * 60 + +start_hr[1];
                      var end   = +end_hr[0] * 60 + +end_hr[1];
                      function inTime() {
                        var time = +start_time_24 * 60 + 0;
                        return time >= start && time < end;
                      }
                      var check_sts = inTime();
                      if(check_sts == true){
                         final_location_list[c].parking_prices = bike_normal_price_time[j].Price;
                      }
                     }
                 }
             }
           }
        }
        if(c == final_location_list.length - 1){
          let da = {
            "start_date" : req.body.start_dates,
            "end_date" : req.body.end_dates,
            "start_time": req.body.start_itme,
            "end_time": req.body.end_time
          }
            res.json({Status:"Success",Message:"List Parking", Data : final_location_list , booking_data : da, Code:200});
        }
     }
}
}
        });
});











router.post('/time_extance_rebooking',async function (req, res){
var datestring = req.body.start_dates;
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var d =  new Date(datestring);
var dayName = days[d.getDay()];
var dayindex = d.getDay();
var vehicle_type = await VehicletypeModel.findOne({_id:req.body.Vehicletype_id});
 var Parking_booking_details = await parkingbookingModel.find({parkingdetails_id:req.body.parking_Details_id});
             for(let c = 0 ; c < final_location_list.length ; c++){
        if(vehicle_type.Vehicle_Type == "Four Wheeler"){
          var car_special_prices = final_location_list[c].parking_details_car_price_spe_day;
          var car_normal_prices = final_location_list[c].parking_details_car_price_day;
           var special_day = 0;
           for(let b = 0 ; b < car_special_prices.length ; b ++){
                if(car_special_prices[b].dates == req.body.start_dates){
                     var start_hr = car_special_prices[b].Start_time.split(":");
                     var end_hr = car_special_prices[b].End_time.split(":");
                      var start =  1 * 60 + 0;
                      var end   = 17 * 60 + 0;
                      function inTime() {
                        var time = req.body.start_itme;
                        return time >= start && time < end;
                      }
                      var check_sts = inTime();
                      if(check_sts == true){
                         final_location_list[c].parking_prices == car_special_prices[b].Price;
                         var special_day = 1;
                      }      
                }
             if(b == car_special_prices.length - 1){
                 if(special_day == 0){
                      car_normal_price_time  = car_normal_prices[dayindex].Timings;
                     for(let j = 0 ; j < car_normal_price_time.length; j++){
                     var start_hr = car_normal_price_time[j].Start_time.split(":");
                     var end_hr = car_normal_price_time[j].End_time.split(":");
                      var start =  1 * 60 + 0;
                      var end   = 17 * 60 + 0;
                      function inTime() {
                        var time = req.body.start_itme;
                        return time >= start && time < end;
                      }
                      var check_sts = inTime();
                      if(check_sts == true){
                         final_location_list[c].parking_prices = car_normal_price_time[j].Price;
                      }
                     }
                 }
             }
           }
        }
        else {
            /////Bike/////
          var bike_special_prices = final_location_list[c].parking_details_bike_price_spe_day;
          var bike_normal_prices = final_location_list[c].parking_details_bike_price_day;
           var special_day = 0;
           for(let b = 0 ; b < bike_special_prices.length ; b ++){
                if(bike_special_prices[b].dates == req.body.start_dates){
                     var start_hr = bike_special_prices[b].Start_time.split(":");
                     var end_hr = bike_special_prices[b].End_time.split(":");
                     var start =  +start_hr[0] * 60 + +start_hr[1];
                     var end   = +end_hr[0] * 60 + +end_hr[1];
                     function inTime() {
                        var time = +req.body.start_itme * 60 + 0;
                        return time >= start && time < end;
                      }
                      var check_sts = inTime();

                      if(check_sts == true){

                         final_location_list[c].parking_prices = bike_special_prices[b].Price;
                         var special_day = 1;
                      }      
                }
             if(b == bike_special_prices.length - 1){
                 if(special_day == 0){
                      bike_normal_price_time  = bike_normal_prices[dayindex].Timings;
     
                     for(let j = 0 ; j < bike_normal_price_time.length; j++){
                     var start_hr = bike_normal_price_time[j].Start_time.split(":");
                     var end_hr = bike_normal_price_time[j].End_time.split(":");
                      var start =  +start_hr[0] * 60 + +start_hr[1];
                      var end   = +end_hr[0] * 60 + +end_hr[1];
                      function inTime() {
                        var time = +req.body.start_itme * 60 + 0;
                        return time >= start && time < end;
                      }
                      var check_sts = inTime();
                      if(check_sts == true){
                         final_location_list[c].parking_prices = bike_normal_price_time[j].Price;
                      }
                     }
                 }
             }
           }
        }
        if(c == final_location_list.length - 1){
            res.json({Status:"Success",Message:"List Parking", Data : final_location_list ,Code:200});
        }
     }
});



///////Duplication Check Datas ///////




///////////////////Prices Details Fetching//////////////
router.post('/parking_change_times',async function (req, res) {
let a = req.body.start_date+" "+req.body.start_time;
let b = req.body.end_date+" "+req.body.end_time;
var date1 = new Date(a);
var date2 = new Date(b);
let first_min = date1.getMinutes()
let last_min = date2.getMinutes()
var msDifference = date2.getTime() - date1.getTime();
let minutesss = Math.floor(msDifference/1000/60);
var total_hrs = timeConvert(minutesss);
var rmins = timeConvert1(minutesss);
function timeConvert1(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return  rminutes;
}
function timeConvert(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return  rhours;
}
var Date_datas = [];
var last_dates = req.body.start_date+" "+req.body.start_time;
for(let d = 0 ; d <= +total_hrs; d++ ){
   datesdd = new Date(last_dates);
   if(d == 0){
months = datesdd.getMonth() + 1

if(+months < 10){
  months = "0"+months;
}
dateas =  datesdd.getFullYear()+"-"+ months +"-"+datesdd.getDate()
var date = datesdd.toLocaleDateString();
var time = datesdd.toLocaleTimeString();
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var k =  new Date(date);
var dayName = days[k.getDay()];
var dayindex = k.getDay();
Spe2 = time.split(":");
   let datess = {
    date : dateas,
    day : dayName,
    hour : Spe2[0],
    min  : first_min,
    index : dayindex
   }
    Date_datas.push(datess);
  }else{
datesdd.setHours(datesdd.getHours() + 1);
months = datesdd.getMonth() + 1

if(+months < 10){
  months = "0"+months;
}
dateas =  datesdd.getFullYear()+"-"+ months +"-"+datesdd.getDate()
var date = datesdd.toLocaleDateString();
var time = datesdd.toLocaleTimeString();
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var k =  new Date(date);
var dayName = days[k.getDay()];
var dayindex = k.getDay();
Spe2 = time.split(":");
   let datess = {
    date : dateas,
    day : dayName,
    hour : Spe2[0],
    min  : last_min,
    index : dayindex
   }
   Date_datas.push(datess);
   last_dates = datesdd;

  }
}
/////////////////Fetch Details //////////////////////
 var final_location_list = await parking_details_Model.find({_id:req.body.parking_vendor_id});
 var vehicle_type = await VehicletypeModel.findOne({_id:req.body.vehicle_type_id});
 var vehicle_type = vehicle_type.Vehicle_Type;
 console.log(vehicle_type);
  if(vehicle_type == "Four Wheeler"){
          Pricess_details = [];
          var ids = [];
          Pricess_amount = 0 ;
          for(let d = 0 ; d < final_location_list.length; d++){ 
            for(let e = 0 ; e < Date_datas.length ; e ++){

              //////// Special Day Pricess ////  
                special_check = 0;
                 for(let s = 0 ; s < final_location_list[d].parking_details_car_price_spe_day.length ; s++ ){
                      if(final_location_list[d].parking_details_car_price_spe_day[s].dates == Date_datas[e].date){
                          if(+Date_datas[e].hour >= +final_location_list[d].parking_details_car_price_spe_day[s].Start_time && +Date_datas[e].hour <= +final_location_list[d].parking_details_car_price_spe_day[s].End_time){ 
                                 special_check = 1 ;
                        var s_five_min_hrs = final_location_list[d].parking_details_car_price_spe_day[s].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                         if(e == 0){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(final_location_list[d].parking_details_car_price_spe_day[s].Price/2); 
                        }
                       else{
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + final_location_list[d].parking_details_car_price_spe_day[s].Price;
                        }
                         if(e == Date_datas.length - 1){
                          final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(final_location_list[d].parking_details_car_price_spe_day[s].Price/2); 
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - v1[f].Price;
                          }
                           if(rmins > 5){
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                         }
                        }
                          }
                      }
                    
                    if(s == final_location_list[d].parking_details_car_price_spe_day.length - 1){
                      if(special_check == 1){
                       
                      }else{
                        
                                 //////Normal Day pricess Filtering Start////////
            var v1 = final_location_list[d].parking_details_car_price_day[+Date_datas[e].index].Timings;
                for(let f = 0 ; f < v1.length; f++){
                 // console.log(final_location_list[d].parking_details_name);
                 //   console.log(Date_datas[e].hour,v1[f].Start_time,v1[f].End_time);
                     if(+Date_datas[e].hour >= +v1[f].Start_time && +Date_datas[e].hour <= +v1[f].End_time){ 
                        var s_five_min_hrs = v1[f].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                        
                        if(e == 0){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2); 
                        }
                        else{
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                        }
                        if(e == Date_datas.length - 1){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2); 
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - v1[f].Price;
                          }
                         if(rmins > 5){
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                         }

                        }

                     } else {
                          ids.push(final_location_list[d]._id);
                     }
                }
          //////Normal Day pricess Filtering end////////
                      }
                    }
                 }  
           }  
           if(d == final_location_list.length - 1) {             
             let a = {
       Price_Details  : [],
       total_price : final_location_list[0].parking_prices
      }
      res.json({Status:"Success",Message:"Available", Data : a ,Code:200});  

           }
        }

 }
else 
{
          Pricess_details = [];
          var ids = [];
          Pricess_amount = 0 ;
          for(let d = 0 ; d < final_location_list.length; d++){ 
            for(let e = 0 ; e < Date_datas.length ; e ++){
              //////// Special Day Pricess ////  
                special_check = 0; //parking_details_bike_price_spe_day
                 for(let s = 0 ; s < final_location_list[d].parking_details_bike_price_spe_day.length ; s++ ){
                      if(final_location_list[d].parking_details_bike_price_spe_day[s].dates == Date_datas[e].date){
                          if(+Date_datas[e].hour >= +final_location_list[d].parking_details_bike_price_spe_day[s].Start_time && +Date_datas[e].hour <= +final_location_list[d].parking_details_bike_price_spe_day[s].End_time){ 
                                 special_check = 1 ;
                        var s_five_min_hrs = final_location_list[d].parking_details_bike_price_spe_day[s].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                        if(e == 0){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(s_five_min_hrs * s_total_mins_count); 
                        }
                        else{
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + final_location_list[d].parking_details_bike_price_spe_day[s].Price;
                        }
                        if(e == Date_datas.length - 1){
                        final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(s_five_min_hrs * e_total_mins_count); 
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - v1[f].Price;
                          }
                        }
                          }
                      }
                    if(s == final_location_list[d].parking_details_bike_price_spe_day.length - 1){
                      if(special_check == 1){
                       
                      }else{
                                 //////Normal Day pricess Filtering Start////////
            var v1 = final_location_list[d].parking_details_bike_price_day[+Date_datas[e].index].Timings;
                for(let f = 0 ; f < v1.length; f++){
                 // console.log(final_location_list[d].parking_details_name);
                 //   console.log(Date_datas[e].hour,v1[f].Start_time,v1[f].End_time);
                     if(+Date_datas[e].hour >= +v1[f].Start_time && +Date_datas[e].hour <= +v1[f].End_time){ 
                        var s_five_min_hrs = v1[f].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                        
                         if(e == 0){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2); 
                        }
                        else{
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                        }
                        if(e == Date_datas.length - 1){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2); 
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - v1[f].Price;
                          }
                         if(rmins > 5){
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                         }

                        }
                     } else {
                          ids.push(final_location_list[d]._id);
                     }
                }
          //////Normal Day pricess Filtering end////////
                      }
                    }
                 }  
           }  
           if(d == final_location_list.length - 1) {
             let a = {
       Price_Details  : [],
       total_price : final_location_list[0].parking_prices
      }
      res.json({Status:"Success",Message:"Available", Data : a ,Code:200});    
     // res.json({Status:"Success",Message:"List Parking", Data : final_location_list , booking_data : da, Code:200});
           }
        }
    
 }









});
////////////Prices Details Fetch End////////////////////////////



//////////// Duplication Check Datas////








///////////////////Prices Details Fetching//////////////
router.post('/parking_change_times1',async function (req, res) {
   var spacecheck = req.body.start_time.split(" ");
   var timecheck = spacecheck[0].split(":");
   if(spacecheck[1] == "PM"){
     if(+timecheck[0] == 12){
      timecheck[0] = +timecheck[0];
     }else{
      timecheck[0] = +timecheck[0]+12
     }
         
   }
   var spacecheck1 = req.body.end_time.split(" ");
   var timecheck1 = spacecheck1[0].split(":");
   if(spacecheck1[1] == "PM"){
      if(+timecheck1[0] == 12){
      timecheck1[0] = +timecheck1[0];
      }else{
      timecheck1[0] = +timecheck1[0]+12
     }
   }
   let end_time_24 = timecheck1[0];
   let start_time_24 = timecheck[0];




 var start_date = req.body.start_date; //mm/dd/yyyy
 var end_date = req.body.end_date;
 var start_time = +start_time_24;
 var end_time = +end_time_24;
 var datestring = start_date;
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var d =  new Date(datestring);
var dayName = days[d.getDay()];
var dayindex = d.getDay();
 var Parking_booking_details = await parking_details_Model.findOne({_id:req.body.parking_vendor_id});
 var vehicle_type = await VehicletypeModel.findOne({_id:req.body.vehicle_type_id});
 var vehicle_type = vehicle_type.Vehicle_Type;
 ////Bike Normal Working Days Prices Fetching//////
 if(vehicle_type == "Two Wheeler"){
  var times_details = Parking_booking_details.parking_details_bike_price_day[dayindex].Timings;
  var total_time_count = Parking_booking_details.parking_details_bike_price_day[dayindex].Timings.length;
  if(total_time_count == 0){
    res.json({Status:"Failed",Message:"Slot not available at time", Data : {} ,Code:200});
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

      let a = {
      Price_Details  : times_detailss,
      total_price : prices
      }
      res.json({Status:"Success",Message:"Available", Data : a ,Code:200});
      }
      }
   }else{
     res.json({Status:"Failed",Message:"Slot not available at time", Data : {} ,Code:200});
   }

 }
 }
 ////Car Normal Working Days Prices Fetching//////
 if(vehicle_type == "Four Wheeler"){
  var times_details = Parking_booking_details.parking_details_car_price_day[dayindex].Timings;
  var total_time_count = Parking_booking_details.parking_details_car_price_day[dayindex].Timings.length;
   if(total_time_count == 0){
    res.json({Status:"Failed",Message:"Slot not available at time", Data : {} ,Code:200});
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

      let a = {
      Price_Details  : times_detailss,
      total_price : prices
      }
      res.json({Status:"Success",Message:"Available", Data : a ,Code:200});
      }
      }
   }else{
     res.json({Status:"Failed",Message:"Slot not available at time", Data : {} ,Code:200});
   }
 }
 }
});
////////////Prices Details Fetch End////////////////////////////



///////////Parking Slot Available//////////////////////////////
router.post('/parking_slot_check_available',async function (req, res) {
   var spacecheck = req.body.start_time.split(" ");
   var timecheck = spacecheck[0].split(":");

   if(spacecheck[1] == "PM"){ 
    if(timecheck[0] == 12){
     timecheck[0] = +timecheck[0];
    }else{
      timecheck[0] = +timecheck[0]+12;
    }
   }

   var spacecheck1 = req.body.end_time.split(" ");
   var timecheck1 = spacecheck1[0].split(":");
   if(spacecheck1[1] == "PM"){
      
      if(timecheck1[0] == 12){
     timecheck1[0] = +timecheck1[0];
    }else{
      timecheck1[0] = +timecheck1[0]+12;
    }

   }
   let end_time_24 = timecheck1[0];
   let start_time_24 = timecheck[0];

 var vehicle_type = await VehicletypeModel.findOne({_id:req.body.vehicle_type_id});
 var vehicle_type = vehicle_type.Vehicle_Type;
     var total_give_start_time = +start_time_24;
     var total_give_end_time =  +end_time_24;
     var datestring = req.body.start_date;
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var d =  new Date(datestring);
var dayName = days[d.getDay()];
var dayindex = d.getDay();
     var parking_Details = await parking_details_Model.findOne({_id:req.body.parking_vendor_id});
     var slot_Details = parking_Details.parking_details_slots_Bike_details;
     var final_location_list = [];
     if(vehicle_type == "Two Wheeler"){
    if(parking_Details.parking_details_price_bike_type == true || parking_Details.parking_details_price_both_type == true){
       var single_day_time = parking_Details.parking_details_bike_price_day[dayindex].Timings;
       var single_day_time_len = single_day_time.length - 1;
       if(single_day_time.length == 0){
             res.json({Status:"Failed",Message:"Slots not available", Data : {},Code:404});
       }
       

       var start_hr_total = +parking_Details.parking_details_bike_price_day[dayindex].Timings[0].Start_time;
       var end_hr_total = +parking_Details.parking_details_bike_price_day[dayindex].Timings[single_day_time_len].End_time;


       if(start_hr_total <= total_give_start_time && end_hr_total >= total_give_end_time){
          var Parking_booking_details_all = await parkingbookingModel.find({});
        var Parking_booking_details = await parkingbookingModel.find({parkingdetails_id:req.body.parking_vendor_id,Vehicle_type_id:req.body.vehicle_type_id});
            var check_sts = 0 ;
            var slot_count_booking = 0;
       for(let d = 0; d < Parking_booking_details.length ; d ++){
                var par_start_time = +Parking_booking_details[d].booking_start_time
                var par_end_time = +Parking_booking_details[d].booking_end_time
                 var par_start_hr_total = +par_start_time;
                 var par_end_hr_total = +par_end_time;
                  if(total_give_start_time <= par_start_hr_total && total_give_end_time >= par_start_hr_total){
                         check_sts = 1;
                         slot_count_booking = slot_count_booking +  1 ;
                         for(let v = 0 ; v < slot_Details.length; v ++){
                          if(slot_Details[v].area == Parking_booking_details[d].block && slot_Details[v].floor == Parking_booking_details[d].floor && slot_Details[v].slot == Parking_booking_details[d].slot){
                            slot_Details.splice(v,1); 
                          }
                         }
                         // array.splice(index, 1);
                 }
                 else if(total_give_start_time <= par_end_hr_total && total_give_end_time >= par_end_hr_total){
                        check_sts = 1;
                        slot_count_booking = slot_count_booking +  1 ;
                         for(let v = 0 ; v < slot_Details.length; v ++){
                          if(slot_Details[v].area == Parking_booking_details[d].block && slot_Details[v].floor == Parking_booking_details[d].floor && slot_Details[v].slot == Parking_booking_details[d].slot){
                            slot_Details.splice(v,1); 
                          }
                         }
                 }
        }
        if(check_sts == 0){
           parking_Details.parking_details_slots_count_Bike = parking_Details.parking_details_slots_count_Bike - slot_count_booking;
           if(parking_Details.parking_details_slots_count_Bike == 0){
               res.json({Status:"Failed",Message:"Slots not available", Data : {},Code:404});
           }else{
             res.json({Status:"Success",Message:"Available Slot Details", Data : slot_Details[0],Code:200});
           }
        }
        else{
           parking_Details.parking_details_slots_count_Bike = parking_Details.parking_details_slots_count_Bike - slot_count_booking;
           if(parking_Details.parking_details_slots_count_Bike == 0){
               res.json({Status:"Failed",Message:"Slots not available", Data : {},Code:404});
           }else{
             res.json({Status:"Success",Message:"Available Slot Details", Data : slot_Details[0],Code:200});
           }
          
        }
       }
       else{
         res.json({Status:"Failed",Message:"Slots not available", Data : {},Code:404});
       }
       }
     } 
     else {
 if(parking_Details.parking_details_price_car_type == true || parking_Details.parking_details_price_both_type == true){
       var single_day_time = parking_Details.parking_details_car_price_day[dayindex].Timings;
       var single_day_time_len = single_day_time.length - 1;
       if(single_day_time.length == 0){
             res.json({Status:"Failed",Message:"Slots not available time", Data : {},Code:404});
       }
       var start_hr_total = +parking_Details.parking_details_car_price_day[dayindex].Timings[0].Start_time;
       var end_hr_total = +parking_Details.parking_details_car_price_day[dayindex].Timings[single_day_time_len].End_time;

       if(start_hr_total <= total_give_start_time && end_hr_total >= total_give_end_time){
          var Parking_booking_details_all = await parkingbookingModel.find({});
        var Parking_booking_details = await parkingbookingModel.find({parkingdetails_id:req.body.parking_vendor_id,Vehicle_type_id:req.body.vehicle_type_id});
            var check_sts = 0 ;
            var slot_count_booking = 0;
       for(let d = 0; d < Parking_booking_details.length ; d ++){
                var par_start_time = +Parking_booking_details[d].booking_start_time
                var par_end_time = +Parking_booking_details[d].booking_end_time
                 var par_start_hr_total = +par_start_time;
                 var par_end_hr_total = +par_end_time;
                  if(total_give_start_time <= par_start_hr_total && total_give_end_time >= par_start_hr_total){
                         check_sts = 1;
                         slot_count_booking = slot_count_booking +  1 ;
                         for(let v = 0 ; v < slot_Details.length; v ++){
                          if(slot_Details[v].area == Parking_booking_details[d].block && slot_Details[v].floor == Parking_booking_details[d].floor && slot_Details[v].slot == Parking_booking_details[d].slot){
                            slot_Details.splice(v,1); 
                          }
                         }
                         // array.splice(index, 1);
                 }
                 else if(total_give_start_time <= par_end_hr_total && total_give_end_time >= par_end_hr_total){
                        check_sts = 1;
                        slot_count_booking = slot_count_booking +  1 ;
                 }
        }
        if(check_sts == 0){

           parking_Details.parking_details_slots_count_Car = parking_Details.parking_details_slots_count_Car - slot_count_booking;
           if(parking_Details.parking_details_slots_count_Car == 0){
               res.json({Status:"Failed",Message:"Slots not available", Data : {},Code:404});
           }else{
             res.json({Status:"Success",Message:"Available Slot Details", Data : slot_Details[0],Code:200});
           }
        }
        else{
           parking_Details.parking_details_slots_count_Car = parking_Details.parking_details_slots_count_Car - slot_count_booking;
           if(parking_Details.parking_details_slots_count_Car == 0){
               res.json({Status:"Failed",Message:"Slots not available", Data : {},Code:404});
           }else{
             res.json({Status:"Success",Message:"Available Slot Details", Data : slot_Details[0],Code:200});
           }
          
        }
       }
       else{
         res.json({Status:"Failed",Message:"Slots not available", Data : {},Code:404});
       }
       }
     }
});
////////////////Parking Slot Available Close////////////////////////////////////////////



///////////Parking Extance Slot Available//////////////////////////////
router.post('/parking_slot_extance_check_available',async function (req, res) {
      var slotdetailss = req.body.slot_details.split("/");


   var spacecheck = req.body.start_time.split(" ");
   var timecheck = spacecheck[0].split(":");
   if(spacecheck[1] == "PM"){
         if(timecheck[0] == 12){
     timecheck[0] = +timecheck[0];
    }else{
      timecheck[0] = +timecheck[0]+12;
    }
    
   }
   var spacecheck1 = req.body.end_time.split(" ");
   var timecheck1 = spacecheck1[0].split(":");
   if(spacecheck1[1] == "PM"){

         if(timecheck1[0] == 12){
     timecheck1[0] = +timecheck1[0];
    }else{
      timecheck1[0] = +timecheck1[0]+12;
    }

   }
   let end_time_24 = timecheck1[0];
   let start_time_24 = timecheck[0];






 var vehicle_type = await VehicletypeModel.findOne({_id:req.body.vehicle_type_id});
     var vehicle_type = vehicle_type.Vehicle_Type;
     var total_give_start_time = +start_time_24;
     var total_give_end_time =  +end_time_24;
     var datestring = req.body.start_date;
     var area = slotdetailss[1] ;
     var floor = slotdetailss[0];
     var slot = slotdetailss[2] ;
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var d =  new Date(datestring);
var dayName = days[d.getDay()];
var dayindex = d.getDay();
     var parking_Details = await parking_details_Model.findOne({_id:req.body.parking_vendor_id});
     var slot_Details = parking_Details.parking_details_slots_Bike_details;
     var final_location_list = [];

     if(vehicle_type == "Two Wheeler"){
    if(parking_Details.parking_details_price_bike_type == true || parking_Details.parking_details_price_both_type == true){
       var single_day_time = parking_Details.parking_details_bike_price_day[dayindex].Timings;
       var single_day_time_len = single_day_time.length - 1;
       if(single_day_time.length == 0){
             res.json({Status:"Failed",Message:"Slots not available", Data : {},Code:404});
       }
       var start_hr_total = +parking_Details.parking_details_bike_price_day[dayindex].Timings[0].Start_time;
       var end_hr_total = +parking_Details.parking_details_bike_price_day[dayindex].Timings[single_day_time_len].End_time;
       if(start_hr_total <= total_give_start_time && end_hr_total >= total_give_end_time){
          var Parking_booking_details_all = await parkingbookingModel.find({});
        var Parking_booking_details = await parkingbookingModel.find({parkingdetails_id:req.body.parking_vendor_id,Vehicle_type_id:req.body.vehicle_type_id,block:area,floor:floor,slot:slot});
            var check_sts = 0 ;
            var slot_count_booking = 0;
       for(let d = 0; d < Parking_booking_details.length ; d ++){
                var par_start_time = +Parking_booking_details[d].booking_start_time
                var par_end_time = +Parking_booking_details[d].booking_end_time
                 var par_start_hr_total = +par_start_time;
                 var par_end_hr_total = +par_end_time;
                  if(total_give_start_time <= par_start_hr_total && total_give_end_time >= par_start_hr_total){
                         check_sts = 1;
                         slot_count_booking = slot_count_booking +  1 ;
                         for(let v = 0 ; v < slot_Details.length; v ++){
                          if(slot_Details[v].area == Parking_booking_details[d].block && slot_Details[v].floor == Parking_booking_details[d].floor && slot_Details[v].slot == Parking_booking_details[d].slot){
                            slot_Details.splice(v,1); 
                          }  
                         }
                         // array.splice(index, 1);
                 }
                 else if(total_give_start_time <= par_end_hr_total && total_give_end_time >= par_end_hr_total){
                        check_sts = 1;
                        slot_count_booking = slot_count_booking +  1 ;
                 }
        }
        if(check_sts == 0){
           if(parking_Details.parking_details_slots_count_Bike == 0){
               res.json({Status:"Failed",Message:"Slots not available", Data : {},Code:404});
           }else{
             res.json({Status:"Success",Message:"Available Slot Details", Data : {},Code:200});
           }
        }
        else{
           if(parking_Details.parking_details_slots_count_Bike == 0){
               res.json({Status:"Failed",Message:"Slots not available", Data : {},Code:404});
           }else{
             res.json({Status:"Success",Message:"Available Slot Details", Data : {},Code:200});
           }
          
        }
       }
       }
     } 
     else {
 if(parking_Details.parking_details_price_car_type == true || parking_Details.parking_details_price_both_type == true){
       var single_day_time = parking_Details.parking_details_car_price_day[dayindex].Timings;
       var single_day_time_len = single_day_time.length - 1;
       if(single_day_time.length == 0){
             res.json({Status:"Failed",Message:"Slots not available time", Data : {},Code:404});
       }
       var start_hr_total = +parking_Details.parking_details_car_price_day[dayindex].Timings[0].Start_time;
       var end_hr_total = +parking_Details.parking_details_car_price_day[dayindex].Timings[single_day_time_len].End_time;

       if(start_hr_total <= total_give_start_time && end_hr_total >= total_give_end_time){
          var Parking_booking_details_all = await parkingbookingModel.find({});
        var Parking_booking_details = await parkingbookingModel.find({parkingdetails_id:req.body.parking_vendor_id,Vehicle_type_id:req.body.vehicle_type_id,block:area,floor:floor,slot:slot});
            var check_sts = 0 ;
            var slot_count_booking = 0;
       for(let d = 0; d < Parking_booking_details.length ; d ++){
                var par_start_time = +Parking_booking_details[d].booking_start_time
                var par_end_time = +Parking_booking_details[d].booking_end_time
                 var par_start_hr_total = +par_start_time;
                 var par_end_hr_total = +par_end_time;
                  if(total_give_start_time <= par_start_hr_total && total_give_end_time >= par_start_hr_total){
                         check_sts = 1;
                         slot_count_booking = slot_count_booking +  1 ;
                         for(let v = 0 ; v < slot_Details.length; v ++){
                          if(slot_Details[v].area == Parking_booking_details[d].block && slot_Details[v].floor == Parking_booking_details[d].floor && slot_Details[v].slot == Parking_booking_details[d].slot){
                            slot_Details.splice(v,1); 
                          }
                         }
                         // array.splice(index, 1);
                 }
                 else if(total_give_start_time <= par_end_hr_total && total_give_end_time >= par_end_hr_total){
                        check_sts = 1;
                        slot_count_booking = slot_count_booking +  1 ;
                 }
        }
        if(check_sts == 0){
 
           parking_Details.parking_details_slots_count_Car = parking_Details.parking_details_slots_count_Car - slot_count_booking;
           if(parking_Details.parking_details_slots_count_Car == 0){
               res.json({Status:"Failed",Message:"Slots not available", Data : {},Code:404});
           }else{
             res.json({Status:"Success",Message:"Available Slot Details", Data : slot_Details[0],Code:200});
           }
        }
        else{
           parking_Details.parking_details_slots_count_Car = parking_Details.parking_details_slots_count_Car - slot_count_booking;
           if(parking_Details.parking_details_slots_count_Car == 0){
               res.json({Status:"Failed",Message:"Slots not available", Data : {},Code:404});
           }else{
             res.json({Status:"Success",Message:"Available Slot Details", Data : slot_Details[0],Code:200});
           }
          
        }
       }
       }
     }
});
////////////////Parking Slot Extance Available Close////////////////////////////////////////////


///////////////////Extance Prices Details Fetching//////////////
router.post('/parking_ext_change_times1',async function (req, res) {


   var spacecheck = req.body.start_time.split(" ");
   var timecheck = spacecheck[0].split(":");
   if(spacecheck[1] == "PM"){
    if(timecheck[0] == 12){
     timecheck[0] = +timecheck[0];
    }else{
      timecheck[0] = +timecheck[0]+12;
    }
         
   }
   var spacecheck1 = req.body.end_time.split(" ");
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



 var start_date = req.body.start_date; //mm/dd/yyyy
 var end_date = req.body.end_date;
 var start_time = +start_time_24;
 var end_time = +end_time_24;
 var datestring = start_date;
var Parking_booking_detailss = await parkingbookingModel.findOne({_id:req.body.booking_id});
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var d =  new Date(datestring);
var dayName = days[d.getDay()];
var dayindex = d.getDay();
 var Parking_booking_details = await parking_details_Model.findOne({_id:req.body.parking_vendor_id});
 var vehicle_type = await VehicletypeModel.findOne({_id:req.body.vehicle_type_id});
 var vehicle_type = vehicle_type.Vehicle_Type;
 ////Bike Normal Working Days Prices Fetching//////
 if(vehicle_type == "Two Wheeler"){
  var times_details = Parking_booking_details.parking_details_bike_price_day[dayindex].Timings;
  var total_time_count = Parking_booking_details.parking_details_bike_price_day[dayindex].Timings.length;
  if(total_time_count == 0){
    res.json({Status:"Failed",Message:"Slot not available at time", Data : {} ,Code:200});
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
     res.json({Status:"Failed",Message:"Slot not available at time", Data : {} ,Code:200});
   }

 }
 }
 ////Car Normal Working Days Prices Fetching//////
 if(vehicle_type == "Four Wheeler"){
  var times_details = Parking_booking_details.parking_details_car_price_day[dayindex].Timings;
  var total_time_count = Parking_booking_details.parking_details_car_price_day[dayindex].Timings.length;
   if(total_time_count == 0){
    res.json({Status:"Failed",Message:"Slot not available at time", Data : {} ,Code:200});
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
   }else{
     res.json({Status:"Failed",Message:"Slot not available at time", Data : {} ,Code:200});
   }
 }
 }
});
////////////Prices Details Fetch End////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////Prices Details Fetching//////////////
router.post('/parking_ext_change_times',async function (req, res) {

console.log('adfasd',req.body);
let a = req.body.start_date+" "+req.body.start_time;
let b = req.body.end_date+" "+req.body.end_time;
var date1 = new Date(a);
var date2 = new Date(b);
let first_min = date1.getMinutes()
let last_min = date2.getMinutes()
var msDifference = date2.getTime() - date1.getTime();
let minutesss = Math.floor(msDifference/1000/60);
var total_hrs = timeConvert(minutesss);

var rmins = timeConvert1(minutesss);
function timeConvert1(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return  rminutes;
}


function timeConvert(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return  rhours;
}
var Date_datas = [];
var last_dates = req.body.start_date+" "+req.body.start_time;
for(let d = 0 ; d <= +total_hrs; d++ ){
   datesdd = new Date(last_dates);
   if(d == 0){
months = datesdd.getMonth() + 1

if(+months < 10){
  months = "0"+months;
}
dateas =  datesdd.getFullYear()+"-"+ months +"-"+datesdd.getDate()
var date = datesdd.toLocaleDateString();
var time = datesdd.toLocaleTimeString();
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var k =  new Date(date);
var dayName = days[k.getDay()];
var dayindex = k.getDay();
Spe2 = time.split(":");
   let datess = {
    date : dateas,
    day : dayName,
    hour : Spe2[0],
    min  : first_min,
    index : dayindex
   }
    Date_datas.push(datess);
  }else{
datesdd.setHours(datesdd.getHours() + 1);
months = datesdd.getMonth() + 1

if(+months < 10){
  months = "0"+months;
}
dateas =  datesdd.getFullYear()+"-"+ months +"-"+datesdd.getDate()
var date = datesdd.toLocaleDateString();
var time = datesdd.toLocaleTimeString();
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var k =  new Date(date);
var dayName = days[k.getDay()];
var dayindex = k.getDay();
Spe2 = time.split(":");
   let datess = {
    date : dateas,
    day : dayName,
    hour : Spe2[0],
    min  : last_min,
    index : dayindex
   }
   Date_datas.push(datess);
   last_dates = datesdd;

  }
}
var Parking_booking_detailss = await parkingbookingModel.findOne({_id:req.body.booking_id});
/////////////////Fetch Details //////////////////////
 var final_location_list = await parking_details_Model.find({_id:req.body.parking_vendor_id});
 var vehicle_type = await VehicletypeModel.findOne({_id:req.body.vehicle_type_id});
 var vehicle_type = vehicle_type.Vehicle_Type;
  if(vehicle_type == "Four Wheeler"){
          Pricess_details = [];
          var ids = [];
          Pricess_amount = 0 ;
          for(let d = 0 ; d < final_location_list.length; d++){ 
            for(let e = 0 ; e < Date_datas.length ; e ++){

              //////// Special Day Pricess ////  
                special_check = 0;
                 for(let s = 0 ; s < final_location_list[d].parking_details_car_price_spe_day.length ; s++ ){
                      if(final_location_list[d].parking_details_car_price_spe_day[s].dates == Date_datas[e].date){
                          if(+Date_datas[e].hour >= +final_location_list[d].parking_details_car_price_spe_day[s].Start_time && +Date_datas[e].hour <= +final_location_list[d].parking_details_car_price_spe_day[s].End_time){ 
                                 special_check = 1 ;
                        var s_five_min_hrs = final_location_list[d].parking_details_car_price_spe_day[s].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                        if(e == 0){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(s_five_min_hrs * s_total_mins_count); 
                        }
                        else{
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + final_location_list[d].parking_details_car_price_spe_day[s].Price;
                        }
                        if(e == Date_datas.length - 1){
                          final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(s_five_min_hrs * e_total_mins_count); 
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - v1[f].Price;
                          }
                        }
                          }
                      }
                    
                    if(s == final_location_list[d].parking_details_car_price_spe_day.length - 1){
                      if(special_check == 1){
                       
                      }else{
                        
                                 //////Normal Day pricess Filtering Start////////
            var v1 = final_location_list[d].parking_details_car_price_day[+Date_datas[e].index].Timings;
                for(let f = 0 ; f < v1.length; f++){
                 // console.log(final_location_list[d].parking_details_name);
                 //   console.log(Date_datas[e].hour,v1[f].Start_time,v1[f].End_time);
                     if(+Date_datas[e].hour >= +v1[f].Start_time && +Date_datas[e].hour <= +v1[f].End_time){ 
                        var s_five_min_hrs = v1[f].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                        if(e == 0){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2); 
                        }
                        else{
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                        }
                        if(e == Date_datas.length - 1){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2); 
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - v1[f].Price;
                          }
                         if(rmins > 5){
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                         }

                         console.log(final_location_list[d].parking_prices);

                        }
                       

                     } else {
                          ids.push(final_location_list[d]._id);
                     }
                }
          //////Normal Day pricess Filtering end////////
                      }
                    }
                 }  
           }  
           if(d == final_location_list.length - 1) {             
            
let g = req.body.start_date+" "+req.body.start_time;
let h = req.body.end_date+" "+req.body.end_time;
var date1 = new Date(g);
var date2 = new Date(h);
var msDifference = date2.getTime() - date1.getTime();
let minutesss = Math.floor(msDifference/1000/60);
var hrs = timeConvert(minutesss);
var rmins = timeConvert1(minutesss);
function timeConvert1(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return  rminutes;
}
function timeConvert(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return  rhours;
}

var prices = final_location_list[d].parking_prices;

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
      Price_Details  : [],
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

 }
else 
{
          Pricess_details = [];
          var ids = [];
          Pricess_amount = 0 ;
          for(let d = 0 ; d < final_location_list.length; d++){ 
            for(let e = 0 ; e < Date_datas.length ; e ++){
              //////// Special Day Pricess ////  
                special_check = 0; //parking_details_bike_price_spe_day
                 for(let s = 0 ; s < final_location_list[d].parking_details_bike_price_spe_day.length ; s++ ){
                      if(final_location_list[d].parking_details_bike_price_spe_day[s].dates == Date_datas[e].date){
                          if(+Date_datas[e].hour >= +final_location_list[d].parking_details_bike_price_spe_day[s].Start_time && +Date_datas[e].hour <= +final_location_list[d].parking_details_bike_price_spe_day[s].End_time){ 
                                 special_check = 1 ;
                        var s_five_min_hrs = final_location_list[d].parking_details_bike_price_spe_day[s].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                        if(e == 0){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(s_five_min_hrs * s_total_mins_count); 
                        }
                        else{
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + final_location_list[d].parking_details_bike_price_spe_day[s].Price;
                        }
                        if(e == Date_datas.length - 1){
                        final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(s_five_min_hrs * e_total_mins_count); 
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - v1[f].Price;
                          }
                        }
                          }
                      }
                    if(s == final_location_list[d].parking_details_bike_price_spe_day.length - 1){
                      if(special_check == 1){
                       
                      }else{
                                 //////Normal Day pricess Filtering Start////////
            var v1 = final_location_list[d].parking_details_bike_price_day[+Date_datas[e].index].Timings;
                for(let f = 0 ; f < v1.length; f++){
                 // console.log(final_location_list[d].parking_details_name);
                 //   console.log(Date_datas[e].hour,v1[f].Start_time,v1[f].End_time);
                     if(+Date_datas[e].hour >= +v1[f].Start_time && +Date_datas[e].hour <= +v1[f].End_time){ 
                        var s_five_min_hrs = v1[f].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                      if(e == 0){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2); 
                        }
                        else{
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                        }
                        if(e == Date_datas.length - 1){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2); 
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - v1[f].Price;
                          }
                         if(rmins > 5){
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                         }
                         console.log(final_location_list[d].parking_prices);
                        }
                     } else {
                          ids.push(final_location_list[d]._id);
                     }
                }
          //////Normal Day pricess Filtering end////////
                      }
                    }
                 }  
           }  
           if(d == final_location_list.length - 1) {        

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

var prices = final_location_list[d].parking_prices;

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
      Price_Details  : [],
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


     // res.json({Status:"Success",Message:"List Parking", Data : final_location_list , booking_data : da, Code:200});
           }
        }
    
 }

});
////////////Prices Details Fetch End////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////




































///////////////////////

router.post('/parking_change_times',async function (req, res) {
let a = req.body.start_date+" "+req.body.start_time;
let b = req.body.end_date+" "+req.body.end_time;
var date1 = new Date(a);
var date2 = new Date(b);
let first_min = date1.getMinutes()
let last_min = date2.getMinutes()
var msDifference = date2.getTime() - date1.getTime();
let minutesss = Math.floor(msDifference/1000/60);
var total_hrs = timeConvert(minutesss);
function timeConvert(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return  rhours;
}
var Date_datas = [];
var last_dates = req.body.start_date+" "+req.body.start_time;
for(let d = 0 ; d <= +total_hrs; d++ ){
   datesdd = new Date(last_dates);
   if(d == 0){
months = datesdd.getMonth() + 1

if(+months < 10){
  months = "0"+months;
}
dateas =  datesdd.getFullYear()+"-"+ months +"-"+datesdd.getDate()
var date = datesdd.toLocaleDateString();
var time = datesdd.toLocaleTimeString();
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var k =  new Date(date);
var dayName = days[k.getDay()];
var dayindex = k.getDay();
Spe2 = time.split(":");
   let datess = {
    date : dateas,
    day : dayName,
    hour : Spe2[0],
    min  : first_min,
    index : dayindex
   }
    Date_datas.push(datess);
  }else{
datesdd.setHours(datesdd.getHours() + 1);
months = datesdd.getMonth() + 1

if(+months < 10){
  months = "0"+months;
}
dateas =  datesdd.getFullYear()+"-"+ months +"-"+datesdd.getDate()
var date = datesdd.toLocaleDateString();
var time = datesdd.toLocaleTimeString();
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var k =  new Date(date);
var dayName = days[k.getDay()];
var dayindex = k.getDay();
Spe2 = time.split(":");
   let datess = {
    date : dateas,
    day : dayName,
    hour : Spe2[0],
    min  : last_min,
    index : dayindex
   }
   Date_datas.push(datess);
   last_dates = datesdd;

  }
}
/////////////////Fetch Details //////////////////////
 var final_location_list = await parking_details_Model.find({_id:req.body.parking_vendor_id});
 var vehicle_type = await VehicletypeModel.findOne({_id:req.body.vehicle_type_id});
 var vehicle_type = vehicle_type.Vehicle_Type;
  if(vehicle_type == "Four Wheeler"){
          Pricess_details = [];
          var ids = [];
          Pricess_amount = 0 ;
          for(let d = 0 ; d < final_location_list.length; d++){ 
            for(let e = 0 ; e < Date_datas.length ; e ++){

              //////// Special Day Pricess ////  
                special_check = 0;
                 for(let s = 0 ; s < final_location_list[d].parking_details_car_price_spe_day.length ; s++ ){
                      if(final_location_list[d].parking_details_car_price_spe_day[s].dates == Date_datas[e].date){
                          if(+Date_datas[e].hour >= +final_location_list[d].parking_details_car_price_spe_day[s].Start_time && +Date_datas[e].hour <= +final_location_list[d].parking_details_car_price_spe_day[s].End_time){ 
                                 special_check = 1 ;
                        var s_five_min_hrs = final_location_list[d].parking_details_car_price_spe_day[s].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                        if(e == 0){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(s_five_min_hrs * s_total_mins_count); 
                        }
                        else{
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + final_location_list[d].parking_details_car_price_spe_day[s].Price;
                        }
                        if(e == Date_datas.length - 1){
                          final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(s_five_min_hrs * e_total_mins_count); 
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - v1[f].Price;
                          }
                        }
                          }
                      }
                    
                    if(s == final_location_list[d].parking_details_car_price_spe_day.length - 1){
                      if(special_check == 1){
                       
                      }else{
                        
                                 //////Normal Day pricess Filtering Start////////
            var v1 = final_location_list[d].parking_details_car_price_day[+Date_datas[e].index].Timings;
                for(let f = 0 ; f < v1.length; f++){
                 // console.log(final_location_list[d].parking_details_name);
                 //   console.log(Date_datas[e].hour,v1[f].Start_time,v1[f].End_time);
                     if(+Date_datas[e].hour >= +v1[f].Start_time && +Date_datas[e].hour <= +v1[f].End_time){ 
                        var s_five_min_hrs = v1[f].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                        
                         if(e == 0){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2); 
                        }
                        else{
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                        }
                         if(e == Date_datas.length - 1){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2); 
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - v1[f].Price;
                          }
                         if(rmins > 5){
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                         }
                        }
                     } else {
                          ids.push(final_location_list[d]._id);
                     }
                }
          //////Normal Day pricess Filtering end////////
                      }
                    }
                 }  
           }  
           if(d == final_location_list.length - 1) {             
             let a = {
       Price_Details  : [],
       total_price : final_location_list[0].parking_prices
      }
      res.json({Status:"Success",Message:"Available", Data : a ,Code:200});  

           }
        }

 }
else 
{
          Pricess_details = [];
          var ids = [];
          Pricess_amount = 0 ;
          for(let d = 0 ; d < final_location_list.length; d++){ 
            for(let e = 0 ; e < Date_datas.length ; e ++){
              //////// Special Day Pricess ////  
                special_check = 0; //parking_details_bike_price_spe_day
                 for(let s = 0 ; s < final_location_list[d].parking_details_bike_price_spe_day.length ; s++ ){
                      if(final_location_list[d].parking_details_bike_price_spe_day[s].dates == Date_datas[e].date){
                          if(+Date_datas[e].hour >= +final_location_list[d].parking_details_bike_price_spe_day[s].Start_time && +Date_datas[e].hour <= +final_location_list[d].parking_details_bike_price_spe_day[s].End_time){ 
                                 special_check = 1 ;
                        var s_five_min_hrs = final_location_list[d].parking_details_bike_price_spe_day[s].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                        if(e == 0){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(s_five_min_hrs * s_total_mins_count); 
                        }
                        else{
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + final_location_list[d].parking_details_bike_price_spe_day[s].Price;
                        }
                        if(e == Date_datas.length - 1){
                        final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(s_five_min_hrs * e_total_mins_count); 
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - v1[f].Price;
                          }
                        }
                          }
                      }
                    if(s == final_location_list[d].parking_details_bike_price_spe_day.length - 1){
                      if(special_check == 1){
                       
                      }else{
                                 //////Normal Day pricess Filtering Start////////
            var v1 = final_location_list[d].parking_details_bike_price_day[+Date_datas[e].index].Timings;
                for(let f = 0 ; f < v1.length; f++){
                 // console.log(final_location_list[d].parking_details_name);
                 //   console.log(Date_datas[e].hour,v1[f].Start_time,v1[f].End_time);
                     if(+Date_datas[e].hour >= +v1[f].Start_time && +Date_datas[e].hour <= +v1[f].End_time){ 
                        var s_five_min_hrs = v1[f].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                       if(e == 0){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2); 
                        }
                        else{
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                        }
                         if(e == Date_datas.length - 1){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2); 
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - v1[f].Price;
                          }
                         if(rmins > 5){
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                         }
                        }
                     } else {
                          ids.push(final_location_list[d]._id);
                     }
                }
          //////Normal Day pricess Filtering end////////
                      }
                    }
                 }  
           }  
           if(d == final_location_list.length - 1) {
             let a = {
       Price_Details  : [],
       total_price : final_location_list[0].parking_prices
      }
      res.json({Status:"Success",Message:"Available", Data : a ,Code:200});    
     // res.json({Status:"Success",Message:"List Parking", Data : final_location_list , booking_data : da, Code:200});
           }
        }
    
 }

});
///////////////////////////
















router.post('/time_extance_api_check1',async function (req, res) {
 var Parking_booking_details = await parkingbookingModel.find({parkingdetails_id:req.body.parking_Details_id,Booking_id:req.body.Booking_id});
            var check_sts = 0 ;
            var slot_count_booking = 0;
       for(let d = 0; d < Parking_booking_details.length ; d ++){
                var par_start_time = Parking_booking_details[d].booking_start_time.split(":");
                var par_end_time = Parking_booking_details[d].booking_end_time.split(":");
                 var par_start_hr_total = +par_start_time[0] * 60 + +par_start_time[1];
                 var par_end_hr_total = +par_end_time[0] * 60 + +par_end_time[1];
                  if(total_give_start_time <= par_start_hr_total && total_give_end_time >= par_start_hr_total){
                        check_sts = 1;
                         slot_count_booking = slot_count_booking +  1 ;
                        res.json({Status:"Failed",Message:"Already Booked", Data : {},Code:404});
                 }
                 else if(total_give_start_time <= par_end_hr_total && total_give_end_time >= par_end_hr_total){
                        check_sts = 1;
                        slot_count_booking = slot_count_booking +  1 ;
                        res.json({Status:"Failed",Message:"Already Booked", Data : {},Code:404});
                 }

                 if(d == Parking_booking_details.length - 1){
                   if(check_sts == 0){
                  res.json({Status:"Success",Message:"Booking Available", Data : {},Code:404});
                      }
                 }
        } 
});




////Mobile User API//
router.post('/getprarking_list_check',async function (req, res) {
     var vehicle_type = "Bike" 
     var time_start = req.body.start_itme;
     var time_end = req.body.end_time;
     var given_time_start = time_start.split(":");
     var give_time_end = time_end.split(":");
     var total_give_start_time = +given_time_start[0] * 60 + +given_time_start[1];
     var total_give_end_time = +give_time_end[0] * 60 + +give_time_end[1];
     var datestring = req.body.dates;
     var d =  new Date(datestring);
     var dayindex = d.getDay();
     var parking_Details = await parking_details_Model.find({});

     var final_location_list = [];
     for(let a = 0 ; a < parking_Details.length; a++){
    if(parking_Details[a].parking_details_price_bike_type == true || parking_Details[a].parking_details_price_both_type == true){
    var point1 = new GeoPoint(+req.body.Location_lat, +req.body.Location_long);
    var point2 = new GeoPoint(+parking_Details[a].parking_details_lat,+parking_Details[a].parking_details_long);
    var distance = point1.distanceTo(point2, false)//output in kilometers
    parking_Details[a].parking_distance = distance.toFixed(2);
    var times =  +distance * 1000; 
    parking_Details[a].parking_reach_time =  times / 3600;
    parking_Details[a].parking_reach_time  = parking_Details[a].parking_reach_time.toFixed(2);
    if(distance > 10){
       var single_day_time = parking_Details[a].parking_details_bike_price_day[dayindex].Timings;
       var single_day_time_len = single_day_time.length - 1;
       var single_day_start_time = parking_Details[a].parking_details_bike_price_day[dayindex].Timings[0].Start_time;
       var single_day_end_time = parking_Details[a].parking_details_bike_price_day[dayindex].Timings[single_day_time_len].End_time;

       var time_start_hrs = single_day_start_time.split(":");
       var time_end_hrs = single_day_end_time.split(":");
       var start_hr_total = +time_start_hrs[0] * 60 + +time_start_hrs[1];
       var end_hr_total = +time_end_hrs[0] * 60 + +time_end_hrs[1];

       if(start_hr_total <= total_give_start_time && end_hr_total >= total_give_end_time){
        var Parking_booking_details = await parkingbookingModel.find({parkingdetails_id:parking_Details[a]._id});
            var check_sts = 0 ;
            var slot_count_booking = 0;
       for(let d = 0; d < Parking_booking_details.length ; d ++){
                var par_start_time = Parking_booking_details[d].booking_start_time.split(":");
                var par_end_time = Parking_booking_details[d].booking_end_time.split(":");
                 var par_start_hr_total = +par_start_time[0] * 60 + +par_start_time[1];
                 var par_end_hr_total = +par_end_time[0] * 60 + +par_end_time[1];
                  if(total_give_start_time <= par_start_hr_total && total_give_end_time >= par_start_hr_total){
                        check_sts = 1;
                         slot_count_booking = slot_count_booking +  1 ;
                 }
                 else if(total_give_start_time <= par_end_hr_total && total_give_end_time >= par_end_hr_total){
                        check_sts = 1;
                        slot_count_booking = slot_count_booking +  1 ;
                 }
        }
        if(check_sts == 0){

        final_location_list.push(parking_Details[a]);
        }
        else{
           parking_Details[a].parking_details_slots_count_Bike = parking_Details[a].parking_details_slots_count_Bike - slot_count_booking;
           if(parking_Details[a].parking_details_slots_count_Bike !== 0){
                final_location_list.push(parking_Details[a]);
           }
        }
       }
     }
       }
       if(a == parking_Details.length - 1){
        res.json({Status:"Success",Message:"List Parking", Data : final_location_list,Code:200});
       }
     }

});







/////////Clock Time Checking///////////////////
router.post('/checktimes', function (req, res) {
        checkin_date  = req.body.checkin_date;
        checkin_time  = req.body.checkin_time;
        checkout_date  = req.body.checkout_date;
        checkout_time  =  req.body.checkout_time;
        let a = checkin_date+" "+checkin_time;
        let b = checkout_date+" "+checkout_time;
         var time = 1000 * 60 * 5;
         var date1 = new Date(a);
         var date2 = new Date(b);
         var rounded1 = new Date(date1.getTime() - (date1.getTime() % time));
         var rounded2 = new Date(date2.getTime() - (date2.getTime() % time));
        var currentTime = (new Date(rounded1))
        var hours = currentTime.getHours()
        //Note: before converting into 12 hour format
        var suffix = '';
        if (hours > 11) {
            suffix += "PM";
        } else {
            suffix += "AM";
        }
        var minutes = currentTime.getMinutes()
        if (minutes < 10) {
            minutes = "0" + minutes
        }
        if (hours > 12) {
            hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }if (hours < 10) {
            hours = "0" + hours
        }
        var time = hours + ":" + minutes + " " + suffix;
        var currentTime2 = (new Date(rounded2))
        var hours = currentTime2.getHours()
        //Note: before converting into 12 hour format
        var suffix = '';
        if (hours > 11) {
            suffix += "PM";
        } else {
            suffix += "AM";
        }
        var minutes = currentTime2.getMinutes()
        if (minutes < 10) {
            minutes = "0" + minutes
        }
        if (hours > 12) {
            hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }if (hours < 10) {
            hours = "0" + hours
        }

var msDifference = date2.getTime() - date1.getTime();
let minutesss = Math.floor(msDifference/1000/60);
function timeConvert(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return  rhours ;
}
        var time2 = hours + ":" + minutes + " " + suffix;
        date_future = new Date(rounded2);
        date_now = new Date(rounded1); 
        seconds = Math.floor((date_future - (date_now))/1000);
        minutes = Math.floor(seconds/60);
        hours = Math.floor(minutes/60);
        days = Math.floor(hours/24);
        hours = hours-(days*24);
        minutes = minutes-(days*24*60)-(hours*60);
        seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
        let datas = {
        days : days,
        hours : hours,
        min : minutes,
        checkin_date : req.body.checkin_date,
        checkin_time :  time,
        checkout_date : req.body.checkout_date,
        checkout_time :  time2,
        total_hrs : timeConvert(minutesss)
        }
        if(hours < 1 && days == 0){
        res.json({Status:"Failed",Message:"Need to Select Min One Hour", Data : datas ,Code:404});
        }else{
             if(datas.days >= 13){
             res.json({Status:"Failed",Message:"Need to Select only below 13 days", Data : datas ,Code:404});
             }else{
                res.json({Status:"Success",Message:"Correct Date", Data : datas ,Code:200});
             }
        }
        
});
/////////Clock Time End/////////////////////



/////////counter_checktime Time Checking///////////////////
router.post('/counter_checktime', function (req, res) {
        checkin_date  = req.body.checkin_date;
        checkin_time  = req.body.checkin_time;
        checkout_date  = req.body.checkout_date;
        checkout_time  =  req.body.checkout_time;
        let a = checkin_date+" "+checkin_time;
        let b = checkout_date+" "+checkout_time;
         var time = 1000 * 60 * 5;
         var date1 = new Date(a);
         var date2 = new Date(b);
         // var rounded1 = new Date(date1.getTime() - (date1.getTime() % time));
         // var rounded2 = new Date(date2.getTime() - (date2.getTime() % time));
        var currentTime = (new Date(date1))
        var hours = currentTime.getHours()
        //Note: before converting into 12 hour format
        var suffix = '';
        if (hours > 11) {
            suffix += "PM";
        } else {
            suffix += "AM";
        }
        var minutes = currentTime.getMinutes()
        if (minutes < 10) {
            minutes = "0" + minutes
        }
        if (hours > 12) {
            hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }if (hours < 10) {
            hours = "0" + hours
        }
        var time = hours + ":" + minutes + " " + suffix;
        var currentTime2 = (new Date(date2))
        var hours = currentTime2.getHours()
        //Note: before converting into 12 hour format
        var suffix = '';
        if (hours > 11) {
            suffix += "PM";
        } else {
            suffix += "AM";
        }
        var minutes = currentTime2.getMinutes()
        if (minutes < 10) {
            minutes = "0" + minutes
        }
        if (hours > 12) {
            hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }if (hours < 10) {
            hours = "0" + hours
        }

var msDifference = date2.getTime() - date1.getTime();
let minutesss = Math.floor(msDifference/1000/60);
function timeConvert(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return  rhours ;
}
        var time2 = hours + ":" + minutes + " " + suffix;
        date_future = new Date(date2);
        date_now = new Date(date1); 
        seconds = Math.floor((date_future - (date_now))/1000);
        minutes = Math.floor(seconds/60);
        hours = Math.floor(minutes/60);
        days = Math.floor(hours/24);
        hours = hours-(days*24);
        minutes = minutes-(days*24*60)-(hours*60);
        seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
        let datas = {
        days : days,
        hours : hours,
        min : minutes,
        checkin_date : req.body.checkin_date,
        checkin_time :  time,
        checkout_date : req.body.checkout_date,
        checkout_time :  time2,
        total_hrs : timeConvert(minutesss)
        }
        if(hours < 1 && days == 0){
        res.json({Status:"Success",Message:"Need to Select Min One Hour", Data : datas ,Code:200});
        }else{
             if(datas.days >= 13){
             res.json({Status:"Success",Message:"Need to Select only below 13 days", Data : datas ,Code:200});
             }else{
                res.json({Status:"Success",Message:"Correct Date", Data : datas ,Code:200});
             }
        }
        
});
/////////Clock Time End/////////////////////


/////////Clock Time Checking///////////////////
router.post('/checktimes2', function (req, res) {
        pre_checkindate = req.body.pre_checkindate;
        checkin_date  = req.body.checkin_date;
        checkin_time  = req.body.checkin_time;
        checkout_date  = req.body.checkout_date;
        checkout_time  =  req.body.checkout_time;
        let a = checkin_date+" "+checkin_time;
        let b = checkout_date+" "+checkout_time;
         var time = 1000 * 60 * 5;
         var date1 = new Date(a);
         var date2 = new Date(b);
         var date3 = new Date(pre_checkindate);
         var rounded1 = new Date(date1.getTime() - (date1.getTime() % time));
         var rounded2 = new Date(date2.getTime() - (date2.getTime() % time));
         var rounded3 = new Date(date3.getTime() - (date3.getTime() % time));

        console.log(rounded3);
        date_future = new Date(rounded2);
        date_now = new Date(rounded3);
        P_seconds = Math.floor((date_future - (date_now))/1000);
        P_minutes = Math.floor(P_seconds/60);
        P_hours = Math.floor(P_minutes/60);
        P_days = Math.floor(P_hours/24);
        console.log(P_days);



        var currentTime = (new Date(rounded1))
        var hours = currentTime.getHours()
        //Note: before converting into 12 hour format
        var suffix = '';
        if (hours > 11) {
            suffix += "PM";
        } else {
            suffix += "AM";
        }
        var minutes = currentTime.getMinutes()
        if (minutes < 10) {
            minutes = "0" + minutes
        }
        if (hours > 12) {
            hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }if (hours < 10) {
            hours = "0" + hours
        }
        var time = hours + ":" + minutes + " " + suffix;
        var currentTime2 = (new Date(rounded2))
        var hours = currentTime2.getHours()
        //Note: before converting into 12 hour format
        var suffix = '';
        if (hours > 11) {
            suffix += "PM";
        } else {
            suffix += "AM";
        }
        var minutes = currentTime2.getMinutes()
        if (minutes < 10) {
            minutes = "0" + minutes
        }
        if (hours > 12) {
            hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }if (hours < 10) {
            hours = "0" + hours
        }

var msDifference = date2.getTime() - date1.getTime();
let minutesss = Math.floor(msDifference/1000/60);
function timeConvert(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return  rhours ;
}
        var time2 = hours + ":" + minutes + " " + suffix;
        date_future = new Date(rounded2);
        date_now = new Date(rounded1); 
        seconds = Math.floor((date_future - (date_now))/1000);
        minutes = Math.floor(seconds/60);
        hours = Math.floor(minutes/60);
        days = Math.floor(hours/24);
        hours = hours-(days*24);
        minutes = minutes-(days*24*60)-(hours*60);
        seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
        let datas = {
        days : days,
        hours : hours,
        min : minutes,
        checkin_date : req.body.checkin_date,
        checkin_time :  time,
        checkout_date : req.body.checkout_date,
        checkout_time :  time2,
        total_hrs : timeConvert(minutesss)
        }
        if(hours < 1 && days == 0){
        res.json({Status:"Failed",Message:"Need to Select Min One Hour", Data : datas ,Code:404});
        }else{
             if(P_days >= 13){
             res.json({Status:"Failed",Message:"Need to Select only below 13 days", Data : datas ,Code:404});
             }else{
                res.json({Status:"Success",Message:"Correct Date", Data : datas ,Code:200});
             }
        }
        
});
/////////Clock Time End/////////////////////



router.post('/getlist_id', function (req, res) {
        parking_details_Model.find({owner_pri_contact:req.body.owner_pri_contact}, function (err, StateList) {
          if(StateList == null){
            res.json({Status:"Success",Message:"New User", Data : {} ,Code:200});
          }else{
            res.json({Status:"Success",Message:"Exist User", Data : {} ,Code:400});
          }
        });
});


router.post('/getlist', function (req, res) {
        parking_details_Model.find({_id:req.body._id}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Parking Details List", Data : Functiondetails ,Code:200});
        }).populate('parking_owner_id');
});


router.get('/Vendor_getlist', function (req, res) {
        parking_details_Model.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Parking Details List", Data : Functiondetails ,Code:200});
        }).populate('parking_owner_id');
});




router.post('/edit',async function (req, res) {
       await parking_details_Model.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
        if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [] ,Code:404});
           }
             res.json({Status:"Success",Message:"Parking Details Updated", Data : UpdatedDetails ,Code:200});
        });
});




router.post('/qrcode', async function(req, res) {
  try{

      var qrdata = {

          Vendor_id: req.body.Vendor_id,

          Vendor_Name :req.body.Vendor_Name,

          Parking_Area_Name: req.body.Parking_Area_Name,

          Vehicletype_id : req.body.Vehicletype_id,


          Lat :req.body.Lat,

          Long : req.body.Long,

          Entry: req.body.Entry,

          Block_Name:req.body.Block_Name
          
          }
          
          var myjson = JSON.stringify(qrdata);

        var QRcodeURL = await QRcodeHelper.QRcode(myjson);


   var QRcodegeneration = {

          "Vendor_id": req.body.Vendor_id,

          "Vendor_Name" :req.body.Vendor_Name,

          "Parking_Area_Name" : req.body.Parking_Area_Name,

          "Vehicletype_id" : req.body.Vehicletype_id,

          "Lat" :req.body.Lat,

          "Long"  : req.body.Long,

          "Entry" : req.body.Entry,

          "Block_Name":req.body.Block_Name,

          "QRcode_Image_URL":QRcodeURL
          
          }

     var QRcode_Details = await QRcodeModel.create(QRcodegeneration);

         res.json({Status:"Success",Message:"Created successfully", Data :QRcode_Details ,Code:200});
}
catch(e){

      res.json({Status:"Failed",Message:"Internal Server Error", Data :[] ,Code:500});
}
});



router.post('/qredit', function (req, res) {
        QRcodeModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Parkingdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});


router.post('/qrdelete', function (req, res) {
      QRcodeModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Parking Deleted successfully", Data : {} ,Code:200});
      });
});




router.get('/qrgetlist', async function (req, res) {
       await QRcodeModel.find({}, function (err, Parkingdetails) {
          res.json({Status:"Success",Message:"Parkingdetails", Data : Parkingdetails ,Code:200});
        }).populate('Allocation_Details');
});



router.post('/qrgetlist_vendor_id', async function (req, res) {
       await QRcodeModel.find({Vendor_id:req.body.Vendor_id}, function (err, Parkingdetails) {
          res.json({Status:"Success",Message:"Parkingdetails", Data : Parkingdetails ,Code:200});
        }).populate('Allocation_Details');
});



// // DELETES A USER FROM THE DATABASE
router.post('/delete',async function (req, res) {
      var parking_Details = await parking_details_Model.findOne({_id : req.body._id});
      parking_details_Model.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          // res.json({Status:"Success",Message:"Parking Details Deleted successfully", Data : {} ,Code:200});
          Parking_owner_Model.findByIdAndRemove(parking_Details.parking_owner_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Parking Owner Deleted successfully", Data : {} ,Code:200});
      });
      });
});


//getprarking_list//
router.post('/getprarking_list',async function (req, res) {
   console.log(req.body);
let a = req.body.start_dates+" "+req.body.start_itme;
let b = req.body.end_dates+" "+req.body.end_time;
var date1 = new Date(a);
var date2 = new Date(b);
let first_min = date1.getMinutes()
let last_min = date2.getMinutes()
var msDifference = date2.getTime() - date1.getTime();
let minutesss = Math.floor(msDifference/1000/60);
var total_hrs = timeConvert(minutesss);
var rmins = timeConvert1(minutesss);
function timeConvert1(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return  rminutes;
}
function timeConvert(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return  rhours;
}
var Date_datas = [];
var last_dates = req.body.start_dates+" "+req.body.start_itme;
for(let d = 0 ; d <= +total_hrs; d++ ){
   datesdd = new Date(last_dates);
   if(d == 0){
months = datesdd.getMonth() + 1

if(+months < 10){
  months = "0"+months;
}
dateas =  datesdd.getFullYear()+"-"+ months +"-"+datesdd.getDate()
var date = datesdd.toLocaleDateString();
var time = datesdd.toLocaleTimeString();
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var k =  new Date(date);
var dayName = days[k.getDay()];
var dayindex = k.getDay();
Spe2 = time.split(":");
   let datess = {
    date : dateas,
    day : dayName,
    hour : Spe2[0],
    min  : first_min,
    index : dayindex
   }
    Date_datas.push(datess);
  }else{
datesdd.setHours(datesdd.getHours() + 1);
months = datesdd.getMonth() + 1

if(+months < 10){
  months = "0"+months;
}
dateas =  datesdd.getFullYear()+"-"+ months +"-"+datesdd.getDate()
var date = datesdd.toLocaleDateString();
var time = datesdd.toLocaleTimeString();
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var k =  new Date(date);
var dayName = days[k.getDay()];
var dayindex = k.getDay();
Spe2 = time.split(":");
   let datess = {
    date : dateas,
    day : dayName,
    hour : Spe2[0],
    min  : last_min,
    index : dayindex
   }
   Date_datas.push(datess);
   last_dates = datesdd;

  }
}
   //////////Fetching Parking Details and Nearest Location///////////
    parking_details_Model.find({},async function (err, StateList) { 
    var parkingbooking_details = await parkingbookingModel.find({Vehicle_type_id:req.body.Vehicletype_id});
    var vehicle_type = await VehicletypeModel.findOne({_id:req.body.Vehicletype_id});
    final_location_list = [];
    for(let a  = 0 ; a < StateList.length ; a ++){
    var point1 = new GeoPoint(+req.body.Location_lat, +req.body.Location_long);
    var point2 = new GeoPoint(+StateList[a].parking_details_lat,+StateList[a].parking_details_long);
    var distance = point1.distanceTo(point2, true)//output in kilometers
    console.log(distance);
    StateList[a].parking_distance = distance.toFixed(2);
    var bike_distance = +distance / 50;
    var car_distance = +distance / 40;
    bike_distance = bike_distance.toFixed(2);
    car_distance =  car_distance.toFixed(2);
    var bike_distance1 = bike_distance .toString();
    var car_distance1 = car_distance .toString();
    var spit1 =  bike_distance1.split(".");
     if(+spit1[1] > 60){
      spit1[0] = +spit1[0] + 1 ;
      spit1[1] = +spit1[1] - 60 ;
      bike_distance1 = ""+spit1[0]+"."+spit1[1];
     }
     var spit2 =  car_distance1.split(".");
     if(Number(spit2[1]) > 60){
      spit2[0] = +spit2[0] + 1 ;
      spit2[1] = +spit2[1] - 60 ;
      car_distance1 = ""+spit2[0]+"."+spit2[1];
     }
     var bike_distance11 = +bike_distance1;
     var car_distance11 = +car_distance1;
    distance = distance.toFixed(2);
    
    ////Testing data/////////
    var ds1 = distance.toString();
    var bk1 = bike_distance1.split(".");
    var cr1 = car_distance1.split(".");
    var ds11 = ds1.split(".");

    if(+bk1[0] == 0){
      bike_distance11 = bk1[1]+" mins"
      if(bike_distance11 == '00 mins'){
        bike_distance11 = "less than a minute";
      }
    }else{
      bike_distance11 = bike_distance11 + " hrs"
    }

    if(+cr1[0] == 0){
      car_distance11 = cr1[1]+" mins"
      if(car_distance11 == '00 mins'){
        car_distance11 = "less than a minute";
      }
    }else{
      car_distance11 = car_distance11 + " hrs"
    }

    var dist = '';
    if(+ds11[0] == 0){
      dist = ds11[1]+" mtr"
    }else{
      dist = distance + " kms"
    }
    StateList[a].parking_distance = dist;
    /////////////Testinf Data end//////
    // StateList[a].parking_distance = distance;
    bike_distance = bike_distance11;
    car_distance = car_distance11;

    if(vehicle_type.Vehicle_Type == "Four Wheeler")
        {
          StateList[a].parking_reach_time = car_distance ;
        } else{
              StateList[a].parking_reach_time = bike_distance ;
        }
    if(distance < 1000){
      final_location_list.push(StateList[a]);
    }
    console.log(distance);
 if(vehicle_type.Vehicle_Type == "Four Wheeler"){
    if(a == StateList.length - 1){
            console.log(final_location_list.length);
        if(final_location_list.length == 0){
          res.json({Status:"Failed",Message:"Parking Details Not Available, Search In different place", Data : [] , Code:404});
        }
          Pricess_details = [];
          var ids = [];
          Pricess_amount = 0 ;
          for(let d = 0 ; d < final_location_list.length; d++){ 
            for(let e = 0 ; e < Date_datas.length ; e ++){
              //////// Special Day Pricess ////  
                special_check = 0;
                 for(let s = 0 ; s < final_location_list[d].parking_details_car_price_spe_day.length ; s++ ){
                      if(final_location_list[d].parking_details_car_price_spe_day[s].dates == Date_datas[e].date){
                          if(+Date_datas[e].hour >= +final_location_list[d].parking_details_car_price_spe_day[s].Start_time && +Date_datas[e].hour <= +final_location_list[d].parking_details_car_price_spe_day[s].End_time){ 
                                 special_check = 1 ;
                        var s_five_min_hrs = final_location_list[d].parking_details_car_price_spe_day[s].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                        if(e == 0){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(final_location_list[d].parking_details_car_price_spe_day[s].Price/2); 
                        }
                        else{
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + final_location_list[d].parking_details_car_price_spe_day[s].Price;
                        }
                        if(e == Date_datas.length - 1){
                          final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(final_location_list[d].parking_details_car_price_spe_day[s].Price/2); 
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - final_location_list[d].parking_details_car_price_spe_day[s].Price;
                          }
                           if(rmins > 5){
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices + final_location_list[d].parking_details_car_price_spe_day[s].Price;
                         }
                        }
                          }
                      }
                    
                    if(s == final_location_list[d].parking_details_car_price_spe_day.length - 1){
                      if(special_check == 1){
                       
                      }else{
                        
                                 //////Normal Day pricess Filtering Start////////
            var v1 = final_location_list[d].parking_details_car_price_day[+Date_datas[e].index].Timings;
                for(let f = 0 ; f < v1.length; f++){
                 // console.log(final_location_list[d].parking_details_name);
                 //   console.log(Date_datas[e].hour,v1[f].Start_time,v1[f].End_time);
                     if(+Date_datas[e].hour >= +v1[f].Start_time && +Date_datas[e].hour <= +v1[f].End_time){ 
                        var s_five_min_hrs = v1[f].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                        
                        if(e == 0){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2); 
                        }
                        else{
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                        }
                        if(e == Date_datas.length - 1){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2); 
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - v1[f].Price;
                          }
                         if(rmins > 5){
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                         }

                        }
                     } else {
                          ids.push(final_location_list[d]._id);
                     }
                }
          //////Normal Day pricess Filtering end////////
                      }
                    }
                 }  
           }  
           if(d == final_location_list.length - 1) {
             var datasdss = final_location_list;
              for(let q = 0 ; q < final_location_list.length ; q++){
                for(let x = 0 ; x < ids.length ; x++ ){
                   if(datasdss[q]._id == ids[x]){
                    datasdss.splice(q, 1);
                    x = ids.length;
                   }
                }
              }
             let da = {
            "start_date" : req.body.start_dates,
            "end_date" : req.body.end_dates,
            "start_time": req.body.start_itme,
            "end_time": req.body.end_time
          }
             for(let a  = 0 ; a < final_location_list.length ; a++){
                 for(let b = 0 ; b < parkingbooking_details.length ; b ++){
                  if(""+parkingbooking_details[b].parkingdetails == ""+final_location_list[a]._id){
                    let user_input_s_d_t_1 = req.body.start_dates+" "+req.body.start_itme;
                    let user_input_e_d_t_1 = req.body.end_dates+" "+req.body.end_time;
                     user_input_s_d_t_1 = new Date(user_input_s_d_t_1);
                     user_input_e_d_t_1 = new Date(user_input_e_d_t_1);
                    let par_book_s_d_t_1 = parkingbooking_details[b].booking_start_date+" "+parkingbooking_details[b].booking_start_time;
                    let par_book_e_d_t_2 = parkingbooking_details[b].booking_end_date+" "+parkingbooking_details[b].booking_end_time;
                    par_book_s_d_t_1 = new Date(par_book_s_d_t_1);
                    par_book_e_d_t_2 = new Date(par_book_e_d_t_2);  
                     var check1 = 0;
                     var check2 = 0;
                     if(par_book_s_d_t_1 <= user_input_s_d_t_1 && user_input_s_d_t_1 <= par_book_e_d_t_2) {
                          check1 = 1
                     }
                     if(par_book_s_d_t_1 <= user_input_e_d_t_1 && user_input_e_d_t_1 <= par_book_e_d_t_2) {
                           check2 = 1
                     }
                     if(check1 !== 0 || check2 !== 0){
                      final_location_list[a].parking_details_slots_count_Car = final_location_list[a].parking_details_slots_count_Car - 1;
                     }
                  }
                 }
               if(a == final_location_list.length - 1){
     
                res.json({Status:"Success",Message:"List Parking", Data : final_location_list , booking_data : da, Code:200});
               }
             }
           }
        }
    }
 }
else 
{
    if(a == StateList.length - 1){
       if(final_location_list.length == 0){
          res.json({Status:"Failed",Message:"Parking Details Not Available, Search In different place", Data : [] , Code:404});
        }
          Pricess_details = [];
          var ids = [];
          Pricess_amount = 0 ;
          for(let d = 0 ; d < final_location_list.length; d++){ 
            for(let e = 0 ; e < Date_datas.length ; e ++){
              //////// Special Day Pricess ////  
                special_check = 0; //parking_details_bike_price_spe_day
                 for(let s = 0 ; s < final_location_list[d].parking_details_bike_price_spe_day.length ; s++ ){
                      if(final_location_list[d].parking_details_bike_price_spe_day[s].dates == Date_datas[e].date){
                          if(+Date_datas[e].hour >= +final_location_list[d].parking_details_bike_price_spe_day[s].Start_time && +Date_datas[e].hour <= +final_location_list[d].parking_details_bike_price_spe_day[s].End_time){ 
                                 special_check = 1 ;
                        var s_five_min_hrs = final_location_list[d].parking_details_bike_price_spe_day[s].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                        if(e == 0){
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(final_location_list[d].parking_details_bike_price_spe_day[s].Price/2); 
                        }
                        else{
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + final_location_list[d].parking_details_bike_price_spe_day[s].Price;
                        }
                        if(e == Date_datas.length - 1){
                        final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(final_location_list[d].parking_details_bike_price_spe_day[s].Price/2); 
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - final_location_list[d].parking_details_car_price_spe_day[s].Price;
                          }
                        if(rmins > 5){
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices + final_location_list[d].parking_details_car_price_spe_day[s].Price;
                         }


                        }
                          }
                      }
                    
                    if(s == final_location_list[d].parking_details_bike_price_spe_day.length - 1){
                      if(special_check == 1){
                       
                      }else{
                                 //////Normal Day pricess Filtering Start////////
            var v1 = final_location_list[d].parking_details_bike_price_day[+Date_datas[e].index].Timings;
                for(let f = 0 ; f < v1.length; f++){
                 // console.log(final_location_list[d].parking_details_name);
                 //   console.log(Date_datas[e].hour,v1[f].Start_time,v1[f].End_time);
                     if(+Date_datas[e].hour >= +v1[f].Start_time && +Date_datas[e].hour <= +v1[f].End_time){ 
                        var s_five_min_hrs = v1[f].Price/12;
                        var s_total_mins_count = Date_datas[0].min/5; 
                        if(s_total_mins_count != 0){
                          var s_total_mins_count = 12 - Date_datas[0].min/5;
                        }
                        var e_total_mins_count = Date_datas[Date_datas.length - 1].min/5;
                        if(e == 0)
                        {
                         final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2); 
                        }
                        else
                        {
                          final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                        }
                        if(e == Date_datas.length - 1){
                       final_location_list[d].parking_prices =  final_location_list[d].parking_prices + Math.round(v1[f].Price/2);
                          if(Math.round(s_five_min_hrs * s_total_mins_count) == 0 && Math.round(s_five_min_hrs * e_total_mins_count) == 0){
                          }else {
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices - v1[f].Price;
                          }

                           if(rmins > 5){
                             final_location_list[d].parking_prices = final_location_list[d].parking_prices + v1[f].Price;
                         }
                        }
                     } else {
                          ids.push(final_location_list[d]._id);
                     }
                }
          //////Normal Day pricess Filtering end////////
                      }
                    }
                 }  
           }  
           if(d == final_location_list.length - 1) {
             var datasdss = final_location_list;
              for(let q = 0 ; q < final_location_list.length ; q++){
                for(let x = 0 ; x < ids.length ; x++ ){
                   if(datasdss[q]._id == ids[x]){
                    datasdss.splice(q, 1);
                    x = ids.length;
                   }
                }
              }
             let da = {
            "start_date" : req.body.start_dates,
            "end_date" : req.body.end_dates,
            "start_time": req.body.start_itme,
            "end_time": req.body.end_time
          }
              for(let a  = 0 ; a < final_location_list.length ; a++){
                 for(let b = 0 ; b < parkingbooking_details.length ; b ++){
                  if(""+parkingbooking_details[b].parkingdetails == ""+final_location_list[a]._id){
                    let user_input_s_d_t_1 = req.body.start_dates+" "+req.body.start_itme;
                    let user_input_e_d_t_1 = req.body.end_dates+" "+req.body.end_time;
                     user_input_s_d_t_1 = new Date(user_input_s_d_t_1);
                     user_input_e_d_t_1 = new Date(user_input_e_d_t_1);
                    let par_book_s_d_t_1 = parkingbooking_details[b].booking_start_date+" "+parkingbooking_details[b].booking_start_time;
                    let par_book_e_d_t_2 = parkingbooking_details[b].booking_end_date+" "+parkingbooking_details[b].booking_end_time;
                    par_book_s_d_t_1 = new Date(par_book_s_d_t_1);
                    par_book_e_d_t_2 = new Date(par_book_e_d_t_2);  
                     var check1 = 0;
                     var check2 = 0;
                     if(par_book_s_d_t_1 <= user_input_s_d_t_1 && user_input_s_d_t_1 <= par_book_e_d_t_2) {
                          check1 = 1
                     }
                     if(par_book_s_d_t_1 <= user_input_e_d_t_1 && user_input_e_d_t_1 <= par_book_e_d_t_2) {
                           check2 = 1
                     }
                     if(check1 !== 0 || check2 !== 0){
                      final_location_list[a].parking_details_slots_count_Bike = final_location_list[a].parking_details_slots_count_Bike - 1;
                     }
                  }
                 }
               if(a == final_location_list.length - 1){
                res.json({Status:"Success",Message:"List Parking", Data : final_location_list , booking_data : da, Code:200});
               }
             }
            // res.json({Status:"Success",Message:"List Parking", Data : final_location_list , booking_data : da, Code:200});
           }
        }
    }
 }
   }
    //////////Fetching Parking Details and Nearest Location End///////////
  });
  });


module.exports = router;

