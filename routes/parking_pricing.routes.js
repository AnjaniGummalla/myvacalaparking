var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var sortJsonArray = require('sort-json-array');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var Parking_Pricing_Model = require('./../models/parking_pricingModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create' , async function(req, res) {
  try{
    var checkthenew = await Parking_Pricing_Model.findOne({parking_owner_id:req.body.parking_owner_id});
    //console.log("checkthenew",checkthenew);
    if(checkthenew === null)
{
  var datajson = {
          "parking_owner_id" : req.body.parking_owner_id,
          "Day":req.body.Day,
          "Vehicle_Type" : req.body.Vehicle_Type,
          "Pricing_Type":req.body.Pricing_Type,
          "Cumulative1_hours":req.body.Cumulative1_hours,
          "Cumulative2_hours":req.body.Cumulative2_hours,
          "Cumulative3_hours":req.body.Cumulative3_hours,
          "Cumulative1_price" : req.body.Cumulative1_price,
          "Cumulative2_price":req.body.Cumulative2_price,
          "Cumulative3_price": req.body.Cumulative3_price,
          "Hourly_Price":req.body.Hourly_Price
  }
  var Savedata1 = await Parking_Pricing_Model.create(datajson);

   res.json({Status:"Success",Message:"Added successfully", Data :Savedata1 ,Code:300}); 
 }
  else{

     let arr =[];
    var daycheck = await Parking_Pricing_Model.find({parking_owner_id:req.body.parking_owner_id,Day:{$in: req.body.Day}});
    //var total_days = await Parking_Pricing_Model.find({parking_owner_id:re}).select('Day')
    console.log("Day from front end", daycheck)
    console.log("daycheck length......",daycheck.length);
    //console.log("daycheck......",total_days);
      if(daycheck.length != 0) {
        
          for(var k=0;k< req.body.Day.length;k++)
          {

             for(var i= 0;i< daycheck.length ;i++)
             {
               console.log("length value", daycheck[i].Day.length)
               
               for(var j=0;j< daycheck[i].Day.length;j++)
               {
                console.log("test log", j)
                console.log("day...." ,daycheck[i].Day[j])  
                if(daycheck[i].Day[j] === req.body.Day[k]);
                if(!arr.includes(daycheck[i].Day[k])){
                 arr.push(daycheck[i].Day[k]) 
                }
                
              }
             }
          }
        //console.log(arr)
        res.json({Status:"Failed",Message:"Data already inserted successfully for " + arr + "", Data :[] ,Code:300});
      }
    else{
        var pricetypecheck = await Parking_Pricing_Model.findOne({parking_owner_id:req.body.parking_owner_id,Pricing_Type:req.body.Pricing_Type});

    console.log("prietype check " ,pricetypecheck)
    if(pricetypecheck == null){
      res.json({Status:"Failed",Message:"Pricing type Mismatched", Data :[] ,Code:300}); 
    }
      else{
          var datajson1= {
          "parking_owner_id" : req.body.parking_owner_id,
          "Day":req.body.Day,
          "Pricing_Type":req.body.Pricing_Type,
          "Cumulative1_hours":req.body.Cumulative1_hours,
          "Cumulative2_hours":req.body.Cumulative2_hours,
          "Cumulative3_hours":req.body.Cumulative3_hours,
          "Cumulative1_price" : req.body.Cumulative1_price,
          "Cumulative2_price":req.body.Cumulative2_price,
          "Cumulative3_price": req.body.Cumulative3_price,
          "Hourly_Price":req.body.Hourly_Price,
          "Vehicle_Type" : req.body.Vehicle_Type,
  }
  var Savedata = await Parking_Pricing_Model.create(datajson1);

   res.json({Status:"Success",Message:"Added successfully", Data :Savedata ,Code:300}); 
      }     
    }
  }          
}
catch(e){
  console.log(e)
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.post('/pricedetails',async function (req, res) {
  
     var Finaldata1 = await Parking_Pricing_Model.find({parking_owner_id:req.body.parking_owner_id}).sort();
     console.log(Finaldata1)
     var arr = [];
     var arr1=[];
      for(var i=0;i<Finaldata1.length;i++)
      {
        console.log("in1")
          for(j=0;j<Finaldata1[i].Day.length;j++)
          {
            var finaldata = {
                                "parking_owner_id" : Finaldata1[i].parking_owner_id,
                                "Day":Finaldata1[i].Day[j],
                                "Pricing_Type": Finaldata1[i].Pricing_Type,
                                "Cumulative1_hours":Finaldata1[i].Cumulative1_hours,
                                "Cumulative2_hours":Finaldata1[i].Cumulative2_hours,
                                "Cumulative3_hours":Finaldata1[i].Cumulative3_hours,
                                "Cumulative1_price" : Finaldata1[i].Cumulative1_price,
                                "Cumulative2_price": Finaldata1[i].Cumulative2_price,
                                "Cumulative3_price": Finaldata1[i].Cumulative3_price,
                                "Hourly_Price": Finaldata1[i].Hourly_Price,
                                "Vehicle_Type" : Finaldata1[i].Vehicle_Type,
              
                            }
              //console.log(i,finaldata)
           arr.push(finaldata);
          }
         var order = { Sunday: 1, Monday: 2, Tuesday: 3, Wednesday: 4, Thursday: 5, Friday: 6, Saturday: 7 };

arr.sort(function (a, b) {
    return order[a.Day] - order[b.Day];
});
        }
        console.log(arr)
          res.json({Status:"Success",Message:"priceslist", Data : arr ,Code:200});
        });


router.post('/pricecheck',async function (req, res) {
  console.log(Pricing_Data);

  dt1 = new Date(req.body.start_date);
  dt2 = new Date(req.body.end_date);
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  var start_day = weekday[dt1.getDay()];
  var end_day = weekday[dt2.getDay()];

/* Get the parking days */
  var parkingDays=[]
  var dt1Index=weekday.indexOf(start_day);
  var dt2Index=weekday.indexOf(end_day);
  console.log("index" ,dt2Index)
  for (var i=dt1Index;i<= dt2Index;i++)
  {
     parkingDays.push(weekday[i])

  }
console.log("days", parkingDays)

/*Get the total number of Hours booked for the pparking */
 
  var diffTime =(dt2.getTime() - dt1.getTime()) / 1000;
  diffTime /= (60 * 60);
  Math.abs(Math.round(diffTime));
  
  console.log(diffTime);

  //console.log(new Date())
var Pricing_Data = await Parking_Pricing_Model.findOne({parking_owner_id:req.body.parking_owner_id,Vehicle_Type:req.body.Vehicle_Type});
  const d1 = new Date(req.body.d1);
  const d2 = new Date(req.body.d2);
if(d1.toString() === d2.toString())
{
  	console.log(dt1.getTime(),dt2.getTime())    
    if(Pricing_Data.Pricing_Type == "C-C-C")
    {
    	var Day_Pricing = await Parking_Pricing_Model.findOne({parking_owner_id:req.body.parking_owner_id,Vehicle_Type:req.body.Vehicle_Type,Day:start_day});
      if(diffTime <= Day_Pricing.Cumulative1_hours)
      {
        var response1 = {
          Title: diffTime + " " + "hours",
          Time: req.body.start_date + " " + "to"+ " "+req.body.end_date,
          Rupees: Day_Pricing.Cumulative1_price
        }
        res.json({Status:"Success",Message:"Finalcost", Data :response1  ,Code:200});
      }
      else if(diffTime<=Day_Pricing.Cumulative2_hours+Day_Pricing.Cumulative1_hours || diffTime == Day_Pricing.Cumulative1_hours+Day_Pricing.Cumulative2_hours)
      {
        var final_cost = Day_Pricing.Cumulative1_price + Day_Pricing.Cumulative2_price;
        var Charge_rate = Day_Pricing.Cumulative2_price;
        var Charging_hrs = diffTime-Day_Pricing.Cumulative1_hours;
       var response1 =[ {
                 Title: Pricing_Data.Cumulative1_hours + " " + "hours",
                 Time: req.body.start_date + " " + "to"+ " "+req.body.end_date,
                 Rupees: Day_Pricing.Cumulative1_price
               },
               {
                 Title: Charging_hrs + " " + "hours",
                 Time: req.body.start_date + " " + "to"+ " "+req.body.end_date,
                 Rupees: Charge_rate
               }]
        res.json({Status:"Success",Message:"Finalcost", Data : response1,final_cost ,Code:200});
      }
      else if(diffTime <= Day_Pricing.Cumulative3_hours)
      {
        var final_cost = Day_Pricing.Cumulative1_price + Day_Pricing.Cumulative2_price + Day_Pricing.Cumulative3_price ;
        var Charging_hrs = diffTime-Day_Pricing.Cumulative1_hours;
        var Charging_hrs1 = diffTime-Charging_hrs;
       var response1 =[ {
                 Title: Pricing_Data.Cumulative1_hours + " " + "hours",
                 Time: req.body.start_date + " " + "to"+ " "+req.body.end_date,
                 Rupees: Day_Pricing.Cumulative1_price
               },
               {
                 Title: Charging_hrs + " " + "hours",
                 Time: req.body.start_date + " " + "to"+ " "+req.body.end_date,
                 Rupees: Day_Pricing.Cumulative2_price
               },{
                  Title: Charging_hrs1 + " " + "hours",
                 Time: req.body.start_date + " " + "to"+ " "+req.body.end_date,
                 Rupees: Day_Pricing.Cumulative3_price
               }]        

               res.json({Status:"Success",Message:"Finalcost", Data : response1,final_cost,Code:200});
      }
      else if(diffTime > Day_Pricing.Cumulative3_hours)
      {
        var Remaining_Hours =  diffTime - (Day_Pricing.Cumulative1_hours + Day_Pricing.Cumulative2_hours + Day_Pricing.Cumulative3_hours);
        console.log("Remaining_Hours",Remaining_Hours);
        var Remaining_hrs_cost = Day_Pricing.Cumulative3_price * Remaining_Hours;
        console.log("Remaining_hrs_cost",Remaining_hrs_cost);
        var final_cost = Day_Pricing.Cumulative1_price + Day_Pricing.Cumulative2_price + Day_Pricing.Cumulative3_price + Remaining_hrs_cost ;  
var response1 =[ {
                 Title: Pricing_Data.Cumulative1_hours + " " + "hours",
                 Time: req.body.start_date + " " + "to"+ " "+req.body.end_date,
                 Rupees: Day_Pricing.Cumulative1_price
               },
               {
                 Title: Charging_hrs + " " + "hours",
                 Time: req.body.start_date + " " + "to"+ " "+req.body.end_date,
                 Rupees: Day_Pricing.Cumulative2_price
               },{
                  Title: Charging_hrs1 + " " + "hours",
                 Time: req.body.start_date + " " + "to"+ " "+req.body.end_date,
                 Rupees: Day_Pricing.Cumulative3_price
               }]       

        res.json({Status:"Success",Message:"Finalcost..", Data :response1,final_cost,Code:200});
      }
    }
}
else
      {
          var Final_Cost = 0;
          var First_Day_time = 24 - (Math.ceil(dt1.getHours()+"."+dt1.getUTCMinutes()));
          //console.log("HOURS....." , Math.ceil(dt1.getHours()+"."+dt1.getUTCMinutes()))
          Math.abs(Math.round(First_Day_time));
          var firstDay=true;
          var finalDay=false;
          var midDaysCount=parkingDays.length-2;

          var Final_day_time=0;
          console.log("Total time", diffTime);

          // console.log("Final day",Final_day_time);
          console.log("Firstday hours", First_Day_time)

      for(var i =0; i<parkingDays.length;i++)
       {
          console.log("Looping Count :",i)
          var Pricing_Data = await Parking_Pricing_Model.findOne({parking_owner_id:req.body.parking_owner_id,Vehicle_Type:req.body.Vehicle_Type,Day:parkingDays[i]});
          console.log("Pricing_Data for ",i,Pricing_Data)
          
          if(firstDay)  //First Day Caliculation
          {
              Final_day_time=First_Day_time;

              if(First_Day_time <= Pricing_Data.Cumulative1_hours)
              {
                 console.log("Fist day amount1",Final_Cost)
                Final_Cost=Pricing_Data.Cumulative1_price
                //res.json({Status:"Success",Message:"Finalcost", Data : Pricing_Data.Cumulative1_price ,Code:200});
              }
              else if(First_Day_time<=Pricing_Data.Cumulative2_hours+Pricing_Data.Cumulative1_hours)
              {
                 console.log("Fist day amount2",Final_Cost)
                Final_Cost = Pricing_Data.Cumulative1_price + Pricing_Data.Cumulative2_price;

                //res.json({Status:"Success",Message:"Finalcost", Data : final_cost ,Code:200});
              }
              else
              {
                console.log("Fist day amount3",Final_Cost)
                Final_Cost = Pricing_Data.Cumulative1_price + Pricing_Data.Cumulative2_price + Pricing_Data.Cumulative3_price;
                var firstdaycost = Final_Cost;
                console.log("after Caliculation", Final_Cost)
                // res.json({Status:"Success",Message:"Finalcost", Data : final_cost ,Code:200});
              }

            console.log("firstday final amount ", Final_Cost);
          }

          if(i+1==parkingDays.length)  // Final Day CaliCulation
          {
              finalDay=true;
              console.log("Final day cost in the fist", Final_Cost);
              Final_day_time=Math.ceil(diffTime-Final_day_time);

              console.log("fINAL DAY time ", Final_day_time)
              if(Final_day_time <= Pricing_Data.Cumulative1_hours)
              {
                console.log("1",Final_Cost+Pricing_Data.Cumulative1_price );
                Final_Cost=Final_Cost+Pricing_Data.Cumulative1_price;
                var finaldaycost = Pricing_Data.Cumulative1_price;
                //res.json({Status:"Success",Message:"Finalcost", Data : Pricing_Data.Cumulative1_price ,Code:200});
              }
              else if(Final_day_time<=Pricing_Data.Cumulative2_hours+Pricing_Data.Cumulative1_hours || Final_day_time == Pricing_Data.Cumulative1_hours+Pricing_Data.Cumulative2_hours)
              {
                console.log("2", Final_Cost,Pricing_Data.Cumulative1_price,Pricing_Data.Cumulative2_price)
                
                var finaldaycost = Pricing_Data.Cumulative1_price + Pricing_Data.Cumulative2_price;

                console.log("finalcost in 2nd loop",finaldaycost)
                
                Final_Cost = Final_Cost+Pricing_Data.Cumulative1_price + Pricing_Data.Cumulative2_price;
                //res.json({Status:"Success",Message:"Finalcost", Data : final_cost ,Code:200});
              }
              else
              {
                console.log("3",Final_Cost,Pricing_Data.Cumulative1_price,Pricing_Data.Cumulative2_price,Pricing_Data.Cumulative3_price)

                Final_Cost = Final_Cost+Pricing_Data.Cumulative1_price + Pricing_Data.Cumulative2_price + Pricing_Data.Cumulative3_price;
                var finaldaycost = Pricing_Data.Cumulative1_price + Pricing_Data.Cumulative2_price + Pricing_Data.Cumulative3_price;

                // res.json({Status:"Success",Message:"Finalcost", Data : final_cost ,Code:200});
              }
              
            console.log("Final day in", Final_Cost) 

          }

          if(midDaysCount>0 && firstDay==false && finalDay==false)
          {
            console.log("Mid day in", Final_Cost);
            Final_day_time=Final_day_time+24;
            //console.log("Final_day_time", Final_day_time)
            Final_Cost = Final_Cost+Pricing_Data.Cumulative1_price + Pricing_Data.Cumulative2_price + Pricing_Data.Cumulative3_price;
            var middledayscost = Pricing_Data.Cumulative1_price + Pricing_Data.Cumulative2_price + Pricing_Data.Cumulative3_price;
          }
          firstDay=false;	

        }
        var response={firstdaycost:firstdaycost,middledays:middledayscost||0,finalcost:finaldaycost,Final_cost_to_user:Final_Cost} 
         res.json({Status:"Success",Message:"Finalcost", Data : response ,Code:200});
      }
});
module.exports = router;