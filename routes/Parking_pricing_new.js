var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var Parking_Pricing_NewModel = require('./../models/Parking_Pricing_NewModel.js');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create' , async function(req, res) {
  try
  {
      //var checkthenew = await Parking_Pricing_NewModel.findOne({Parking_VendorDetails_Id:req.body.Parking_VendorDetails_Id});
      var datajson = {
              "Parking_VendorDetails_Id" : req.body.Parking_VendorDetails_Id,
              "Parking_Hours":req.body.Parking_Hours,
              "Parking_Day_Cost":req.body.Parking_Day_Cost,
              "Parking_Monthly_Price":req.body.Parking_Monthly_Price,
              "Vehicle_Type" : req.body.Vehicle_Type,
              "Pricing_Type":req.body.Pricing_Type,
      }
      console.log(datajson)
    var Savedata = await Parking_Pricing_NewModel.create(datajson);
    res.json({Status:"Success",Message:"Added successfully", Data :Savedata ,Code:300}); 
 }        
catch(e)
    {
      console.log(e)
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
    }
});

router.post('/getlist',async function (req, res) 
{
 	await Parking_Pricing_NewModel.find({Parking_VendorDetails_Id:req.body.Parking_VendorDetails_Id}, function (err, parkingdetails) 
     {
         res.json({Status:"Success",Message:"parkingdetails", Data : parkingdetails ,Code:200});
        });
});

router.post('/vendorlist',async function (req, res) 
{

    if(req.body.Pricing_Type=="Hourly")
      {
          var Response = await Parking_Pricing_NewModel.find({Vehicle_Type:req.body.Vehicle_Type,Pricing_Type:req.body.Pricing_Type}).select({Parking_Hours: {$elemMatch: {To_hr: { $gte: req.body.Hours }}}}).select('Parking_VendorDetails_Id Vehicle_Type');
          console.log(Response)
          res.json({Status:"Success",Message:"Vendor parking list for Hourly basis", Data :Response ,Code:200});
      }
      else if(req.body.Pricing_Type=="Monthly")
      {
          var Data = await Parking_Pricing_NewModel.find({Vehicle_Type:req.body.Vehicle_Type,Pricing_Type:req.body.Pricing_Type}).select('Parking_VendorDetails_Id Parking_Monthly_Price Vehicle_Type');
          console.log(Data)
        res.json({Status:"Success",Message:"Vendor parking list for monthly", Data :Data ,Code:200});
      }
      else
      {

        var Data = await Parking_Pricing_NewModel.find({Vehicle_Type:req.body.Vehicle_Type,Pricing_Type:req.body.Pricing_Type}).select('Parking_VendorDetails_Id Parking_Day_Cost Vehicle_Type');
          console.log(Data)
        res.json({Status:"Success",Message:"Vendor parking list for Daily", Data :Data ,Code:200});
      }
});

router.post('/getmatch',async function (req, res) {
	
      if(req.body.Pricing_Type=="Hourly")
    	{
      		var Response = await Parking_Pricing_NewModel.findOne({Parking_VendorDetails_Id:req.body.Parking_VendorDetails_Id,Vehicle_Type:req.body.Vehicle_Type,Pricing_Type:req.body.Pricing_Type}).select({ Parking_Hours: {$elemMatch: {To_hr: { $gte: req.body.Hours }}}});
       	  res.json({Status:"Success",Message:"Total cost for the parking", Data :Response ,Code:200});
      }
    	else if(req.body.Pricing_Type=="Monthly")
    	{
        		var Data = await Parking_Pricing_NewModel.findOne({Parking_VendorDetails_Id:req.body.Parking_VendorDetails_Id,Vehicle_Type:req.body.Vehicle_Type,Pricing_Type:req.body.Pricing_Type}).select('Parking_Monthly_Price');
        		console.log(Data)
            var Cost = Data.Parking_Monthly_Price * req.body.Pricing_Months;
      		  var Response = 
        	   {
          			Total_Cost: Cost,
          			Pricing_Months: req.body.Pricing_Months
        		  }
    		    res.json({Status:"Success",Message:"Total cost for the parking", Data :Response ,Code:200});
    	}
      else
      {
          var Data = await Parking_Pricing_NewModel.findOne({Parking_VendorDetails_Id:req.body.Parking_VendorDetails_Id,Vehicle_Type:req.body.Vehicle_Type,Pricing_Type:req.body.Pricing_Type}).select('Parking_Day_Cost');
          console.log(Data)
          var Cost = Data.Parking_Day_Cost * req.body.Parking_Days;
          var Response = 
             {
                Total_Cost: Cost,
                Parking_Days: req.body.Parking_Days
              }
          res.json({Status:"Success",Message:"Total cost for the parking", Data : Response ,Code:200});
      }  
        
});


module.exports = router;