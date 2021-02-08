var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var parking_details_Model = require('./../models/parking_details_Model');
var parkingbookingModel = require('./../models/Parkingbooking_NewModel.js');
var Parking_Pricing_NewModel = require('./../models/Parking_Pricing_NewModel.js');
var Parking_owner_Model = require('./../models/parking_owner_Model');
var VehicletypeModel = require('./../models/VehicletypeModel');
var GeoPoint = require('geopoint');
var moment = require('moment'); // require


router.post('/vendorslist', async function (req, res) {
 
    console.log("Vedor detils req qwerty", req.body);


	let Customer_lat=req.body.lat;
	let Customer_long=req.body.long;
	var Vehicletype=req.body.Vehicle_Type;
	var Finalvendorlist = [];
	var arr =[];
	var Finaldata = [];
	var filterDatas=[];
	var Booking_Start_Date = req.body.Booking_Start_Date;
    var Booking_Start_Time = req.body.Booking_Start_Time;
    var Booking_End_Time = "";
    var Booking_End_Date = "";
    var Updated_Count = 0;
 var time = req.body.Booking_Start_Time;
 console.log("VendorList",time);
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

	var Vendorlocationlist = await parking_details_Model.find({}).select('parking_details_lat parking_details_long parking_vendor_id');
	var Mergeddata = await Parking_Pricing_NewModel.aggregate([
   {
      $lookup:
         {
            from: "parkingdetails",
            localField: "Parking_VendorDetails_Id",
            foreignField: "_id",
            as: "Pricing_Information"
        },
   }
]);
    for(var m=0;m<Mergeddata.length;m++){
        if(Mergeddata[m].Pricing_Type==req.body.Pricing_Type && Mergeddata[m].Vehicle_Type[0]==req.body.Vehicle_Type){
            filterDatas.push(Mergeddata[m])
        }
        //console.log("Mergeddata...@@@#####",Mergeddata[m].Vehicle_Type[0])
    }
    
	//fliter to get the data only for the requested price type

	// filterDatas=Mergeddata.filter(await function(filterData)
	// 	{
 //            return filterData.Pricing_Type==req.body.Pricing_Type && filterData.Vehicle_Type==req.body.Vehicle_Type;
	// 	});
 	//To get the single json of the requested time from the user
	console.log(filterDatas,"filtering data before checking Hourly")
	if(req.body.Pricing_Type=="Hourly")
	{
	 filterDatas = filterDatas
	
    .filter((element) => 
        element.Parking_Hours.some((subElement) => req.body.Hours>=subElement.From_hr  && req.body.Hours<=subElement.To_hr))
    .map(element => {
        let newElt = Object.assign({}, element); // copies element
        newElt.Parking_Hours = newElt.Parking_Hours.filter(subElement => req.body.Hours>=subElement.From_hr  && req.body.Hours<=subElement.To_hr); 
        return newElt;
    });
	}
  //console.log("aaaaaaaaaaa",filterDatas);
	for (var i = 0;i<filterDatas.length; i++)
	{
		const startPoint = new GeoPoint(Customer_lat,Customer_long);
        console.log("testting..........",filterDatas.length)
	    const endPoint = new GeoPoint(filterDatas[i].Pricing_Information[0].parking_details_lat,filterDatas[i].Pricing_Information[0].parking_details_long);
	    const distance = startPoint.distanceTo(endPoint,true).toFixed(2);
	    var timecal = (distance/40).toFixed(2);
	    filterDatas[i].Pricing_Information[0].parking_reach_time=timecal + ' '+ 'hrs';
	    filterDatas[i].Pricing_Information[0].parking_distance = distance + ' '+  'kms';
    // if(req.body.Vehicle_Type=="5f0c0d092f857d66950cf260"){
    // filterDatas[i].Pricing_Information[0].parking_details_slots_count_Bike = Updated_Count;	
    // }

    console.log(Updated_Count)
    if(req.body.Pricing_Type=="Monthly"){
    Booking_Start_Date = req.body.Booking_Start_Date;
    var Month_Count = req.body.Month_Count;
    var newdate = new Date(Booking_Start_Date);
    //console.log("newdate",newdate)
     Booking_End_Date = new Date(newdate.setMonth(newdate.getMonth()+ +Month_Count));
     Booking_End_Time = Booking_End_Date;
    //console.log(Booking_End_Date);
    }
    else if(req.body.Pricing_Type=="Daily"){
    var date = req.body.Booking_Start_Date;
    var result = new Date(date);
    //console.log(result)
    result.setDate(result.getDate() + +req.body.Day_Count);
     Booking_End_Date = result;
     Booking_End_Time = result;
    //console.log(Booking_End_Date,"Booking_End_Date")
    }
    else if(req.body.Pricing_Type=="Hourly"){
    Booking_End_Time = new Date(Booking_Start_Time);
     console.log(Booking_Start_Time,"Check........++++++++")
    Booking_End_Time.setHours(Booking_End_Time.getHours()+ +req.body.Hours);
    //console.log(Booking_End_Time,"check.....@@@@@@@@@");
    Booking_End_Date = Booking_Start_Date;
    }
    // guru_code
   var test3 = await parkingbookingModel.find({Parkingdetails_Id:filterDatas[i].Parking_VendorDetails_Id,Vehicle_Type_Id:req.body.Vehicle_Type});
   //console.log(test3);
   var slot_not_availabel = 0 ;
   if(req.body.Vehicle_Type=="5f0c0d092f857d66950cf260")
    {
   for(let y = 0 ; y < test3.length ; y ++){
    Booking_Start_Time = new Date(Booking_Start_Time);
    test3[y].Booking_Start_Time = new Date(test3[y].Booking_Start_Time);
    Booking_End_Time = new Date(Booking_End_Time);
    test3[y].Booking_End_Time = new Date(test3[y].Booking_End_Time);
     //console.log(Booking_Start_Time,test3[y].Booking_Start_Time,Booking_End_Time);
     //console.log(Booking_Start_Time,test3[y].Booking_End_Time,Booking_End_Time);
     if(Booking_Start_Time <= test3[y].Booking_Start_Time && test3[y].Booking_Start_Time <= Booking_End_Time){
        console.log("In");
         slot_not_availabel = slot_not_availabel + 1
     }else if (Booking_Start_Time <= test3[y].Booking_End_Time && test3[y].Booking_End_Time <= Booking_End_Time){
           slot_not_availabel = slot_not_availabel + 1
     }
     if(y == test3.length - 1){
       console.log("slot_not_availabel",slot_not_availabel)
    var Total_slots_available = await parking_details_Model.find({_id:filterDatas[i].Parking_VendorDetails_Id}).select('parking_details_slots_count_Bike');
    //console.log("vendor slots", Total_slots_available[0].parking_details_slots_count_Car);
    //console.log(test3)
    var Updated_Count = Total_slots_available[0].parking_details_slots_count_Bike - slot_not_availabel;
    console.log("updated count in test2",Updated_Count);
     filterDatas[i].Pricing_Information[0].parking_details_slots_count_Bike = Updated_Count;
     }     
   }   
}
else if(req.body.Vehicle_Type=="5f0c0cfc2f857d66950cf25f")
{
     for(let y = 0 ; y < test3.length ; y ++){
    Booking_Start_Time = new Date(Booking_Start_Time);
    test3[y].Booking_Start_Time = new Date(test3[y].Booking_Start_Time);
    Booking_End_Time = new Date(Booking_End_Time);
    test3[y].Booking_End_Time = new Date(test3[y].Booking_End_Time);
     console.log(Booking_Start_Time,test3[y].Booking_Start_Time,Booking_End_Time);
     console.log(Booking_Start_Time,test3[y].Booking_End_Time,Booking_End_Time);
     if(Booking_Start_Time <= test3[y].Booking_Start_Time && test3[y].Booking_Start_Time <= Booking_End_Time){
        console.log("In");
         slot_not_availabel = slot_not_availabel + 1
     }else if (Booking_Start_Time <= test3[y].Booking_End_Time && test3[y].Booking_End_Time <= Booking_End_Time){
           slot_not_availabel = slot_not_availabel + 1
     }
     if(y == test3.length - 1){
       console.log("slot_not_availabel",slot_not_availabel)
    var Total_slots_available = await parking_details_Model.find({_id:filterDatas[i].Parking_VendorDetails_Id}).select('parking_details_slots_count_Car');
    //console.log("vendor slots", Total_slots_available[0].parking_details_slots_count_Car);
    //console.log(test3)
    var Updated_Count = Total_slots_available[0].parking_details_slots_count_Car - slot_not_availabel;
    console.log("updated count in test2",Updated_Count);
     filterDatas[i].Pricing_Information[0].parking_details_slots_count_Car = Updated_Count;
     }     
   } 
}  
Finalvendorlist.push(filterDatas[i]);      
}

    for(j=0;j<Finalvendorlist.length;j++){
    	console.log(Finalvendorlist.length,"length of Finalvendorlist")
    	for(k=0;k<Finalvendorlist[j].Pricing_Information.length;k++){
    		console.log("inner",Finalvendorlist[j].Pricing_Information.length);
    		console.log("booking enf time", Booking_End_Time.toISOString().slice(12,16));
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

console.log(formatAMPM(Booking_End_Time));
    		var Converted_time = formatAMPM(Booking_End_Time);


    		if(req.body.Pricing_Type=="Hourly")
    		{
    			 var finaloutput = {
                                                                             "Parking_Vendor_Id" : Finalvendorlist[j].Parking_VendorDetails_Id,
                                                                             "parking_prices":Finalvendorlist[j].Parking_Hours[0].pay,
                                                                             "Booking_Start_Time" : req.body.Booking_Start_Time,
											                                 "Booking_Start_Date": req.body.Booking_Start_Date,
											                                 "Booking_End_Date":Booking_End_Date,
											                                 "Booking_End_Time":Converted_time,
											                                 "Hours":req.body.Hours,
																			 "Month_Count":req.body.Month_Count,
																			 "Day_Count":req.body.Day_Count,
                                                                             "parking_reach_time":Finalvendorlist[j].Pricing_Information[k].parking_reach_time,
                                                                             "Pricing_Type": Finalvendorlist[j].Pricing_Type,
                                                                             "parking_distance":Finalvendorlist[j].Pricing_Information[k].parking_distance,
                                                                             "Vehicle_Type":Finalvendorlist[j].Vehicle_Type[0],
                                                                             "Parking_Hours":[Finalvendorlist[j].Parking_Hours[0]],
                                                                             "parking_details_slots_count_Bike":Finalvendorlist[j].Pricing_Information[k].parking_details_slots_count_Bike,
                                                                             "parking_details_slots_count_Car":Finalvendorlist[j].Pricing_Information[k].parking_details_slots_count_Car,
                                                                             "parking_details_name":Finalvendorlist[j].Pricing_Information[k].parking_details_name,
                                                                             "parking_details_address":Finalvendorlist[j].Pricing_Information[k].parking_details_address,
                                                                             "parking_details_lat":Finalvendorlist[j].Pricing_Information[k].parking_details_lat,
                                                                             "parking_details_long":Finalvendorlist[j].Pricing_Information[k].parking_details_long,
                                                                             "parking_details_maplink":Finalvendorlist[j].Pricing_Information[k].parking_details_maplink,
                                                           
                                             }
              //console.log("hi",finaloutput);
                             arr.push(finaloutput); 
               console.log("pushed data..",finaloutput);

              
           
    	}
    	else if(req.body.Pricing_Type=="Monthly"){
    		var finaloutput = {
                                "Parking_Vendor_Id" : Finalvendorlist[j].Parking_VendorDetails_Id,
                                "parking_prices":Finalvendorlist[j].Parking_Monthly_Price,
								"Booking_Start_Time":req.body.Booking_Start_Time,
								"Booking_Start_Date":req.body.Booking_Start_Date,
								"Booking_End_Time":Converted_time,
								"Booking_End_Date":Booking_End_Date,
								"Hours":req.body.Hours,
								"Month_Count":req.body.Month_Count,
								"Day_Count":req.body.Day_Count,
                                "parking_reach_time":Finalvendorlist[j].Pricing_Information[k].parking_reach_time,
                                "Pricing_Type": Finalvendorlist[j].Pricing_Type,
                                "parking_distance":Finalvendorlist[j].Pricing_Information[k].parking_distance,
                                "Vehicle_Type":Finalvendorlist[j].Vehicle_Type[0],
                                "Parking_Monthly_Price":Finalvendorlist[j].Parking_Monthly_Price,
                                "parking_details_slots_count_Bike":Finalvendorlist[j].Pricing_Information[k].parking_details_slots_count_Bike,
                                "parking_details_slots_count_Car":Finalvendorlist[j].Pricing_Information[k].parking_details_slots_count_Car,
                                "parking_details_name":Finalvendorlist[j].Pricing_Information[k].parking_details_name,
                                "parking_details_address":Finalvendorlist[j].Pricing_Information[k].parking_details_address,
                                "parking_details_lat":Finalvendorlist[j].Pricing_Information[k].parking_details_lat,
                                "parking_details_long":Finalvendorlist[j].Pricing_Information[k].parking_details_long,
                                "parking_details_maplink":Finalvendorlist[j].Pricing_Information[k].parking_details_maplink,
              
                            }
// if(Finalvendorlist[j].Pricing_Information[k].parking_distance<1000){
              arr.push(finaloutput); 
//               }

    	}
    		else if(req.body.Pricing_Type=="Daily"){
    		var finaloutput = {
                                "Parking_Vendor_Id" : Finalvendorlist[j].Parking_VendorDetails_Id,
                                "parking_prices":Finalvendorlist[j].Parking_Day_Cost,
			                    "Booking_Start_Time":req.body.Booking_Start_Time,
								"Booking_Start_Date":req.body.Booking_Start_Date,
								"Booking_End_Time":Converted_time,
								"Booking_End_Date":Booking_End_Date,
								"Hours":req.body.Hours,
								"Month_Count":req.body.Month_Count,
								"Day_Count":req.body.Day_Count,
                                "parking_reach_time":Finalvendorlist[j].Pricing_Information[k].parking_reach_time,
                                "Pricing_Type": Finalvendorlist[j].Pricing_Type,
                                "parking_distance":Finalvendorlist[j].Pricing_Information[k].parking_distance,
                                "Vehicle_Type":Finalvendorlist[j].Vehicle_Type[0],
                                "parking_details_slots_count_Bike":Finalvendorlist[j].Pricing_Information[k].parking_details_slots_count_Bike,
                                "parking_details_slots_count_Car":Finalvendorlist[j].Pricing_Information[k].parking_details_slots_count_Car,
                                "parking_details_name":Finalvendorlist[j].Pricing_Information[k].parking_details_name,
                                "parking_details_address":Finalvendorlist[j].Pricing_Information[k].parking_details_address,
                                "parking_details_lat":Finalvendorlist[j].Pricing_Information[k].parking_details_lat,
                                "parking_details_long":Finalvendorlist[j].Pricing_Information[k].parking_details_long,
                                "parking_details_maplink":Finalvendorlist[j].Pricing_Information[k].parking_details_maplink,
                            }
              // if(Finalvendorlist[j].Pricing_Information[k].parking_distance<1000){
               arr.push(finaloutput); 
              // }

    	}
    }
}
				var Booking_Date = {
					"Booking_Start_Time":req.body.Booking_Start_Time,
					"Booking_Start_Date":req.body.Booking_Start_Date,
					"Booking_End_Time":Converted_time,
					"Booking_End_Date":Booking_End_Date,
				}
	res.json({Status:"Success",Message:"Parking Details Retrived successfully", Data : arr ,Booking_Date,Code:200}); 

});

router.post('/getvendor',async function (req, res) {
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

    var Updated_Count_car = 0;
    var Updated_Count_bike = 0;
    var FinalPrice = 0;
    var Reach_Time = 0;
    //console.log(Updated_Count);
    //distance and time calculations
    let Customer_lat=req.body.lat;
	let Customer_long=req.body.long;
	var vendorlocationdetails = await parking_details_Model.findOne({_id:req.body.Parking_VendorDetails_Id});
    const startPoint = new GeoPoint(Customer_lat,Customer_long);
	const endPoint = new GeoPoint(vendorlocationdetails.parking_details_lat,vendorlocationdetails.parking_details_long);
	const Distance = startPoint.distanceTo(endPoint,true).toFixed(2);
	//Reach_Time = (Distance/40).toFixed(2);
	 if(req.body.Pricing_Type=="Hourly")
    	{
    		Booking_End_Date = Booking_Start_Date;
		    Booking_End_Time = new Date(Booking_Start_Time);
           console.log("End time1",Booking_End_Time);
		    Booking_End_Time.setHours(Booking_End_Time.getHours()+ +req.body.Hourly_Count);
            console.log(req.body.Parking_VendorDetails_Id,req.body.Vehicle_Type,req.body.Pricing_Type,+req.body.Hourly_Count);
      		var Data = await Parking_Pricing_NewModel.findOne({Parking_VendorDetails_Id:req.body.Parking_VendorDetails_Id,Vehicle_Type:req.body.Vehicle_Type,Pricing_Type:req.body.Pricing_Type}).select({ Parking_Hours: {$elemMatch: {To_hr: { $gte: +req.body.Hourly_Count }}}}).select('-_id');
            console.log("amount details",Data);
      		var FinalPrice = Data.pay;
            console.log("End time",Booking_End_Time);

      }
    else if(req.body.Pricing_Type=="Monthly"){
			    Booking_Start_Date = req.body.Booking_Start_Date;
			    var Month_Count = req.body.Month_Count;
			    var newdate = new Date(Booking_Start_Date);
			    console.log("newdate",newdate)
			    Booking_End_Date = new Date(newdate.setMonth(newdate.getMonth()+ +Month_Count));
			    Booking_End_Time = Booking_End_Date;
			    var Data = await Parking_Pricing_NewModel.findOne({Parking_VendorDetails_Id:req.body.Parking_VendorDetails_Id,Vehicle_Type:req.body.Vehicle_Type,Pricing_Type:req.body.Pricing_Type}).select('Parking_Monthly_Price');
			    var FinalPrice = Data.Parking_Monthly_Price * req.body.Pricing_Months;
			   
    }
    else if(req.body.Pricing_Type=="Daily"){
    var date = req.body.Booking_Start_Date;
    var result = new Date(date);
    console.log(result)
    result.setDate(result.getDate() + +req.body.Day_Count);
     Booking_End_Date = result;
     Booking_End_Time = result;
     var Data = await Parking_Pricing_NewModel.findOne({Parking_VendorDetails_Id:req.body.Parking_VendorDetails_Id,Vehicle_Type:req.body.Vehicle_Type,Pricing_Type:req.body.Pricing_Type}).select('Parking_Day_Cost');
          console.log(Data)
          var FinalPrice = Data.Parking_Day_Cost * req.body.Day_Count;
    }
    //GET THE COUNT OF THE AVAILABLE SLOTS
    var test3 = await parkingbookingModel.find({Parkingdetails_Id:req.body.Parking_VendorDetails_Id,Vehicle_Type_Id:req.body.Vehicle_Type});
   	var slot_not_availabel = 0 ;
   for(let y = 0 ; y < test3.length ; y ++){
    Booking_Start_Time = new Date(Booking_Start_Time);
    test3[y].Booking_Start_Time = new Date(test3[y].Booking_Start_Time);
    Booking_End_Time = new Date(Booking_End_Time);
    console.log("Test1", Booking_End_Time);
    test3[y].Booking_End_Time = new Date(test3[y].Booking_End_Time);
     console.log(Booking_Start_Time,test3[y].Booking_Start_Time,Booking_End_Time);
     console.log(Booking_Start_Time,test3[y].Booking_End_Time,Booking_End_Time);
     if(Booking_Start_Time <= test3[y].Booking_Start_Time && test3[y].Booking_Start_Time <= Booking_End_Time){
        console.log("In");
         slot_not_availabel = slot_not_availabel + 1
     }else if (Booking_Start_Time <= test3[y].Booking_End_Time && test3[y].Booking_End_Time <= Booking_End_Time){
           slot_not_availabel = slot_not_availabel + 1
     }
     if(y == test3.length - 1){
       console.log("slot_not_availabel",slot_not_availabel)
     if(req.body.Vehicle_Type=="5f0c0cfc2f857d66950cf25f")
     {
     var Total_slots_available = await parking_details_Model.find({_id:req.body.Parking_VendorDetails_Id});
    //console.log("vendor slots", Total_slots_available[0].parking_details_slots_count_Car);
    console.log(Total_slots_available[0].parking_details_slots_count_Car, "###########")
    Updated_Count_car = Total_slots_available[0].parking_details_slots_count_Car - slot_not_availabel;
    Updated_Count_bike = Total_slots_available[0].parking_details_slots_count_Bike;
    Reach_Time = (Distance/40).toFixed(2)+" " +"hrs";
    console.log("updated count in test four wheeler",Updated_Count_car,Updated_Count_bike);
     }
    else if(req.body.Vehicle_Type=="5f0c0d092f857d66950cf260"){
     var Total_slots_available = await parking_details_Model.find({_id:req.body.Parking_VendorDetails_Id});
    //console.log("vendor slots", Total_slots_available[0].parking_details_slots_count_Car);
    console.log(test3)
    Updated_Count_bike = Total_slots_available[0].parking_details_slots_count_Bike - slot_not_availabel;
    Updated_Count_car = Total_slots_available[0].parking_details_slots_count_Car;
    Reach_Time = (Distance/30).toFixed(2)+ " " + "hrs";
    //console.log("updated count in test2",Updated_Count);   
    }
    
     }
   }
   console.log("DAtas",Booking_End_Time);
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

console.log(formatAMPM(Booking_End_Time));
    		var Converted_time = formatAMPM(Booking_End_Time);
   var finaloutput=	{
   	 							"Parking_Vendor_Id" : req.body.Parking_Vendor_Id,
                                "Parking_Prices": FinalPrice,
                                "Booking_Start_Time":req.body.Booking_Start_Time,
								"Booking_Start_Date":req.body.Booking_Start_Date,
								"Booking_End_Time":Converted_time,
								"Booking_End_Date":Booking_End_Date,
                                "parking_reach_time":Reach_Time,
                                "Pricing_Type":req.body.Pricing_Type,
                                "parking_distance":Distance,
                                "Vehicle_Type":req.body.Vehicle_Type,
                                "parking_details_slots_count_Bike":Updated_Count_bike,
                                "parking_details_slots_count_Car":Updated_Count_car,
                                "parking_details_name":vendorlocationdetails.parking_details_name,
                                "parking_details_address":vendorlocationdetails.parking_details_address,
                                "parking_details_lat":vendorlocationdetails.parking_details_lat,
                                "parking_details_long":vendorlocationdetails.parking_details_long,
                                "parking_details_maplink":vendorlocationdetails.parking_details_maplink,
                                "Booking_Hours" : 0,
                                "Booking_Hours_cost" : 0,
                                "Booking_Hours_details" : [],
                                "Parking_Hours_count" : 0,
                                "Booking_Days" : 0,
                                "Parking_Day_Cost" : 0,
                                "Booking_Months" : 0,
                                "Parking_Monthly_Price" : 0
}
if(req.body.Pricing_Type=="Hourly"){
	finaloutput["Booking_Hours"] = req.body.Hours;
	finaloutput["Booking_Hours_details"] = Data;
    finaloutput["Parking_Hours_count"] = req.body.Hourly_Count;
    finaloutput["Booking_Hours_cost"] = Data.Parking_Hours[0].pay;
    finaloutput["Parking_Prices"] = Data.Parking_Hours[0].pay;
}
else if(req.body.Pricing_Type=="Daily"){
	finaloutput["Booking_Days"] = req.body.Day_Count;
	finaloutput["Parking_Day_Cost"] = Data.Parking_Day_Cost;
     
}
else if(req.body.Pricing_Type=="Monthly"){
	finaloutput["Booking_Months"] = req.body.Month_Count;
	finaloutput["Parking_Monthly_Price"] = Data.Parking_Monthly_Price;
}
res.json({Status:"Success",Message:"Parking Details Retrived successfully", Data : finaloutput ,Code:200});

});

module.exports = router;