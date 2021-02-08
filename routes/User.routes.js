var express = require('express');
var router = express.Router();
var path = require('path')
const requestss = require("request");
const jwt = require('jsonwebtoken');
var RM = require('random-number');
var bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
var ForgotMailer = require('./../helpers/email.helper');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var UserModel = require('./../models/UserModel');
var CurrentlocationModel = require('./../models/Customer_LocationModel');
var Customer_LocationModel = require('./../models/Customer_LocationModel');
var CustomeraltlocationModel = require('./../models/Customer_Alt_LocationModel');
var Vehicle_TypeModel = require('./../models/VehicletypeModel')
var CustomerhomelocationModel = require('./../models/Home_LocationModel');
var MasterServiceModel = require('./../models/MasterserviceModel');
var CustomerModel = require('./../models/CustomerModel');
var DriverModel = require('./../models/DriverModel');
var MechanicModel = require('./../models/MechanicModel');
var EmployeeModel = require('./../models/EmployeeModel');
var PermissionModel = require('./../models/PermissionModel');
var HomebannerModel = require('./../models/HomebannerModel');
var VehicleModel = require('./../models/VehicleModel');
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
var VerifyToken = require('./VerifyToken');
var mobileappdetailsModel = require('./../models/mobileappdetailsModel');
const { check, validationResult } = require('express-validator');

var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
app.use(fileUpload());
let BaseUrl = "https://myvacala.com";


router.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    console.log(req.files)
    res.json({Status:"Failed",Message:"No files found", Data :{},Code:300});
    return;
  }

  sampleFile = req.files.sampleFile;

  var ext = path.extname(sampleFile.name);
      let filename = uuidv4() + ext;
      console.log(filename);
// if(ext!= ".jpg" && ext!= ".gif" && ext!= ".jpeg"){

//    return res.json({Status:"Failed",Message:"Please make sure to upload valid format", Data :{} ,Code:300});
// }
// else{

  uploadPath = __dirname + '/public/uploads/' + filename;

  var Finalpath =  BaseUrl +'/api/uploads/'+ filename;


   console.log("uploaded path",uploadPath );

  sampleFile.mv(uploadPath, function(err) {
    if (err) {
   console.log(err)
   //return res.json({Status:"Failed",Message:"Internal Server Error", Data :{},Code:300});
    }
   return res.json({Status:"Success",Message:"file upload success", Data :Finalpath,Code:200});
  });
//}
});

router.post('/pdfupload', async function(req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    console.log(req.files)
    res.json({Status:"Failed",Message:"No files found", Data :{},Code:300});
    return;
  }
  
  sampleFile = req.files.sampleFile;

  var ext =  await path.extname(sampleFile.name);
      let filename = uuidv4() + ext;
      console.log(ext);
      if(ext!= ".pdf"){
        return res.json({Status:"Failed",Message:"Please make sure to upload PDF", Data :{} ,Code:300});
      }
else{


  uploadPath = __dirname + '/public/uploads/' + filename;

  var Finalpath =  BaseUrl +'/api/uploads/'+ filename;


   console.log("uploaded path",uploadPath );

  sampleFile.mv(uploadPath, function(err) {
    if (err) {
   console.log(err)
   //return res.json({Status:"Failed",Message:"Internal Server Error", Data :{},Code:300});
    }
   return res.json({Status:"Success",Message:"file upload success", Data :Finalpath,Code:200});
  });
}
});

router.post('/register',[
    check('Email').not().isEmpty().isEmail().withMessage("Not a valid email"),
    check('Phone').not().isEmpty().isLength({ min: 10 }).withMessage("Not a valid Phone number")
  ], async function(req, res) {
  try{
  	const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message:errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
    else{
     var UserModelCheck = await UserModel.findOne({Email:req.body.Email});
     var CustomerModelCheck = await CustomerModel.findOne({Email:req.body.Email});
     console.log("Testing");
     if(UserModelCheck != null || CustomerModelCheck != null){
           res.json({Status:"Failed",Message:"Email id already exists", Data : {},Code:300}); 
        }
        else{
          UserModel.create({
          Name : req.body.Name,
          Email : req.body.Email,
          Phone : req.body.Phone,
          Type: req.body.Type,
          Password:req.body.Password,
        },
async function (err, user) {
           if (err) return res.json({Status:"Failed",Message:"There was a problem in registering. Try again", Data : user,Code:300});
    else{
       if(req.body.Type == 0){
        res.json({Status:"Success",Message:"Registration Done successfully", Data : user ,Code:200});
       }
       else if(req.body.Type == 1)
       {
        var options = {
      min:  1000,
      max: 10000,
      integer: true
    }
     var OTP = RM(options);
         var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.Phone;
        var message =
          "Hi, Your OTP is " + OTP + ". My Vacala OTP for login.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls = "http://hpsms.dial4sms.com/api/web2sms.php?workingkey=Ae55238ca8df1af661e3700330b7e0c66&sender=MYVCLA&to="+mobilno+"&message="+message ;
        console.log(baseurls);
        requestss(baseurls, { json: true }, async (err, response, body) => {
          if (err) {
            return console.log(err);
          }
          else{
             let fields ={    
           Email:req.body.Email || "",
           Type:req.body.Type || "",
           Password:req.body.Password || "",
           Address : req.body.Address || "",
           Phone : req.body.Phone || "",
           Profile_Pic : req.body.Profile_Pic || "",
           OTP : OTP
        }
        var CustomerData = await CustomerModel.create(fields);
        res.json({Status:"Success",Message:"OTP has been sent successfully for the registred mobile number", Data : {OTP : OTP} ,Code:200});
          }
        });
       
       }
       else if(req.body.Type == 2){
        let driverfields ={
           Name : req.body.Name || "",
           Gender : req.body.Gender || "",
           Email:req.body.Email || "",
           Type:req.body.Type || "",
           Password:req.body.Password || "",
           Address_Proof : req.body.Address_Proof || "",
           Primary_Contact : req.body.Primary_Contact || "",
           Adhaar_Card : req.body.Adhaar_Card || "",
        }
        var DriverData = await DriverModel.create(driverfields);
        res.json({Status:"Success",Message:"Registration Done successfully", Data :DriverData ,Code:200});
       }
        } 
     });
    }
    }  
  }
  catch(e){
     res.json({Status:"Failed",Message:"Internal Server Error", Data :{},Code:500});
   }    
});


router.post('/mobile/newuser',[
    check('Email').not().isEmpty().withMessage("Please enter a Email"),
    check('Name').not().isEmpty().withMessage("Please enter a Name"),
  ], async function (req, res) {
    try{
       const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
     }
else{
     let Customerfields ={
           "Name" : req.body.Name || "",
           "Email":req.body.Email || "",
           "Phone" : req.body.Phone || "",
           "DOB":req.body.DOB || "",
           "Gender":req.body.Gender || "",
           "Vehicle_Type_Status": false,
           "Current_Location_Status": false,
          // "Customer_Location": currentlocation._id || "",
           "User_Status": true,
           // Customer_alt_Location: currentaltlocations._id || "",
           // Customer_Home_Location: currenthomelocations._id || "",
        }
     
      var CustomerDataaa = await CustomerModel.findOne({Email:req.body.Email});
      console.log(CustomerDataaa);
      if(CustomerDataaa !== null){
          res.json({Status:"Failed",Message:"Email Id already exists", Data :{},Code:404}); 
      }else{
         var CustomerDataaa = await CustomerModel.create(Customerfields);
         res.json({Status:"Success",Message:"Profile updated Successfully", Data :CustomerDataaa,Code:200}); 
      }
 }
}
    catch(e){
      console.log(e)
       res.json({Status:"Failed",Message:"Internal server error", Data :{},Code:300});
    }
});




router.post('/mobile/addlocation', async function (req, res) {
    try{
   var lat = req.body.lat;
   var long = req.body.long;

   var check =  await Customer_LocationModel.find({Customer_Location:{
            "type": "Point",
            "coordinates": [
               lat,long
            ]
        },Customer_id:req.body.Customer_id});
   var Defaultcheck = await Customer_LocationModel.find({Customer_id:req.body.Customer_id});
   console.log(Defaultcheck);
    var statust = "";
    if(Defaultcheck == "")
     {
      statust = "Default";
     }   
   if(check == ""){
    let customerlocation = 
    {
      "City": req.body.City ||  "" ,
      "State":req.body.State  ||  "" ,
      "DOB":req.body.DOB || "",
      "Country":req.body.Country  ||  "" ,
      "Pincode": req.body.Pincode  ||  "" ,
      "Street": req.body.Street ||  "",
      "NearBy_LandMark":req.body.NearBy_LandMark ||  "",
      "Location_NickName":req.body.Location_NickName || "",
      "Flat_No":req.body.Flat_No || "",
      "Customer_Location": {type: "Point", coordinates: [lat, long] },
      "Customer_id": req.body.Customer_id || "",
      "lat": lat,
      "long": long,
      "Location_type":req.body.Location_type || "",
      "Status": statust
    }
      var currentlocation = await Customer_LocationModel.create(customerlocation);
      var customerdatalocationstatus = await CustomerModel.findByIdAndUpdate({_id:req.body.Customer_id},{Current_Location_Status: true},{new: true});
      console.log("customerdatalocationstatus....",customerdatalocationstatus);
         res.json({Status:"Success",Message:"Added location Successfully", Data :currentlocation,Code:200}); 
    
   }
   else{
     res.json({Status:"Failed",Message:"Location Already Added", Data :{} ,Code:300});
   }
  
 }
  catch(e){
      console.log(e)
       res.json({Status:"Failed",Message:"Internal server error", Data :{},Code:300});
    }

});



router.post('/mobile/getuserstatus',  function (req, res) {
        CustomerModel.find({"_id": req.body.Customer_id}, function (err, Servicedetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicedetails.length == 0){
            res.json({Status:"Failed",Message:"No User Details found", Data : Servicedetails ,Code:404});
           }else{
             res.json({Status:"Success",Message:"User details", Data : Servicedetails ,Code:200});
           }
        });
});









router.post('/mobile/registermobile', async function (req, res) {
    var Phonenumber = req.body.Phone;
    try {
      var phonecheck = await CustomerModel.findOne({Phone:req.body.Phone});
      console.log(phonecheck)
    if(phonecheck == null)
{
    var options = {
      min:  1000,
      max: 10000,
      integer: true
    }
     var OTP = RM(options);
         var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.Phone;
        var message =
          "Hi, Welcome to MyVACALA Your OTP is " + OTP + ".Please use this to verify your account";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls = "http://hpsms.dial4sms.com/api/web2sms.php?workingkey=Ae55238ca8df1af661e3700330b7e0c66&sender=MYVCLA&to="+mobilno+"&message="+message ;
        console.log(baseurls);
        requestss(baseurls, { json: true }, async (err, response, body) => {
          if (err) {
            return console.log(err);
          }
          else{

        res.json({Status:"Success",Message:"OTP has been sent successfully! welcome to Myvacala", Userstatus:"New User", OTP: OTP, Data :{},Code:200});
          }
        });
      }
        else{
      var options = {
      min:  1000,
      max: 10000,
      integer: true
    }
     var OTP = RM(options);
         var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.Phone;
        var message =
          "Hi, Your OTP is " + OTP + ".Please use this to verify your account.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls = "http://hpsms.dial4sms.com/api/web2sms.php?workingkey=Ae55238ca8df1af661e3700330b7e0c66&sender=MYVCLA&to="+mobilno+"&message="+message ;
         
        console.log(baseurls);
        requestss(baseurls, { json: true }, async (err, response, body) => {
          if (err) {
            return console.log(err);
          }
          else{
           
        res.json({Status:"Success",Message:"OTP has been sent successfully for the registered mobile number",Userstatus:"Exists", OTP: OTP ,Data : phonecheck ,Code:200});
          }
        });
      }        
       }
catch(e){
   res.json({Status:"Success",Message:"Internal Server Error", Data :[],Code:200});
}
});


router.post('/login',  async function(req, res) {
      try{
    var password = req.body.Mobilenumber;
    var Datacheck = await UserModel.findOne({Email:req.body.Email});
    console.log(Datacheck);
    if(Datacheck == null){
     res.json({Status:"Failed",Message:"Email id not found", Data : {},Code:401});
    }
    const validate = await Datacheck.isValidPassword(password);
        if (!validate) {
        return res.json({Status:"Failed",Message:"Incorrect password", Data : {},Code:401});
         }
    else
    {
      const jwtToken = process.env.JWT_SECRET;
      const token = jwt.sign({ user: req.body.Email }, jwtToken);
      console.log("USer Token", token);
      let responseData = {
                        token: token,
                        user: Datacheck
                    }
      res.json({Status:"Success",Message:"Login Successful", Data : responseData ,Code:200});
    }  
  }
  catch(e){
       console.log(e)
       res.json({Status:"Failed",Message:"Internal server issue", Data :{},Code:500});
     }    
  });

router.post('/employeelogin',async function(req, res) {
    var Primary_Contact = req.body.Primary_Contact;
    try {
      var phonecheck = await EmployeeModel.findOne({Primary_Contact:req.body.Primary_Contact});
      console.log(phonecheck)
    if(phonecheck == "")
      {
        res.json({Status:"Failed",Message:"Please enter registered Mobile number", Data : [] ,Code:300});     
      }
        else{
      var options = {
      min:  1000,
      max: 10000,
      integer: true
    }
     var OTP = RM(options);
         var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.Primary_Contact;
        var message =
          "Hi, Your OTP is " + OTP + ".Please use this to verify your account.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls = "http://hpsms.dial4sms.com/api/web2sms.php?workingkey=Ae55238ca8df1af661e3700330b7e0c66&sender=MYVCLA&to="+mobilno+"&message="+message ;
        console.log(baseurls);
        requestss(baseurls, { json: true }, async (err, response, body) => {
          if (err) {
            return console.log(err);
          }
          else{
              const filter = { Primary_Contact: req.body.Primary_Contact};
              const update = { OTP: OTP };
      let Data = await EmployeeModel.findOneAndUpdate(filter, update, {new: true});
        res.json({Status:"Success",Message:"OTP has been sent successfully for the registered mobile number",Data : {usedetails:Primary_Contact,OTP : OTP} ,Code:200});
          }
        });
      }        
       }
catch(e){
   res.json({Status:"Success",Message:"Internal Server Error", Data :[],Code:200});
}
});

router.post('/customerlogin',[
    //check('Phone').not().isEmpty().isLength({ min: 10 }).withMessage("Not a valid Phone number")
  ],async function(req, res) {
      try{
          const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
     }
    console.log("request...",req.body);
    var options = {
      min:  1000,
      max: 10000,
      integer: true
    }
    var Datacheck = await CustomerModel.findOne({Primary_Contact:req.body.Primary_Contact});
    console.log(RM(options));
    var OTP = RM(options);
    if(Datacheck == null){
     res.json({Status:"Failed",Message:"Invalid User Account", Data : {},Code:300});
    }else
    {
      const filter = { Primary_Contact: req.body.Primary_Contact};
      const update = { OTP: OTP };
      let Data = await CustomerModel.findOneAndUpdate(filter, update, {new: true});
      var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.Primary_Contact;
        var message =
          "Hi, Your OTP is " + OTP + ". My Vacala OTP for login.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls = "http://hpsms.dial4sms.com/api/web2sms.php?workingkey=Ae55238ca8df1af661e3700330b7e0c66&sender=MYVCLA&to="+mobilno+"&message="+message ;
        console.log(baseurls);
        requestss(baseurls, { json: true }, (err, res, body) => {
          if (err) {
            return console.log(err);
          }
        });
      res.json({Status:"Success",Message:"Login Successful", Data : OTP  ,Code:200});
    }  
 }
   catch(e){
        console.log(e)
       res.json({Status:"Failed",Message:"Internal server issue", Data :{},Code:500});
     }    
  });

router.post('/customerotpverify', [
    check('Phone').not().isEmpty().isLength({ min: 10 }).withMessage("Not a valid Phone number"),
    check('OTP').not().isEmpty().withMessage("Please provide valid Details")
  ], async function (req, res) {
    try{
      const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
     }
    var Datacheck = await CustomerModel.findOne({Primary_Contact:req.body.Primary_Contact,OTP:req.body.OTP});
    if(Datacheck == null){
    res.json({Status:"Failed",Message:"Invalid OTP", Data :{},Code:300});
     }
else
    {
      const jwtToken = process.env.JWT_SECRET;
      const token = jwt.sign({ user: req.body.Primary_Contact }, jwtToken);
      console.log("USer Token", token);
      let responseData = {
                        token: token,
                        user: Datacheck,
                    }
    res.json({Status:"Success",Message:"Login Successful", Data : responseData ,Code:200});
    }
    }
    catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
    }
});

router.post('/employeeotpverify', [
    check('Primary_Contact').not().isEmpty().isLength({ min: 10 }).withMessage("Not a valid Phone number"),
    check('OTP').not().isEmpty().withMessage("Please provide valid Details")
  ], async function (req, res) {
    try{
      const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
     }
    var Datacheck = await EmployeeModel.findOne({Primary_Contact:req.body.Primary_Contact,OTP:req.body.OTP});
    if(Datacheck == null){
    res.json({Status:"Failed",Message:"Invalid OTP", Data :{},Code:300});
     }
else
    {
      const jwtToken = process.env.JWT_SECRET;
      const token = jwt.sign({ user: req.body.Primary_Contact }, jwtToken);
      console.log("USer Token", token);
      var permissions = await PermissionModel.findOne({Primary_Contact:req.body.Primary_Contact})
      let responseData = {
                        token: token,
                        user: Datacheck,
                        permissions:permissions
                    }
    res.json({Status:"Success",Message:"Login Successful", Data : responseData ,Code:200});
    }
    }
    catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
    }
});

router.post('/driverlogin',  async function(req, res) {
      try{
    var Datacheck = await DriverModel.findOne({Email:req.body.Email,Password:req.body.Password});
    console.log(Datacheck);
    if(Datacheck == null){
     res.json({Status:"Failed",Message:"Invalid User Account", Data : {},Code:300});
    }else
    {
      res.json({Status:"Success",Message:"Login Successful", Data : Datacheck,Code:200});
    }  
 }
   catch(e){
       res.json({Status:"Failed",Message:"Internal server issue", Data :{},Code:500});
     }    
  });

router.post('/forgotpassword', async function(req, res) {
      UserModel.findOne({ Email: req.body.Email }, async function (err, user) {
        if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        if (!user){
         res.json({Status:"Failed",Message:"Invalid Email Id. Enter registered Email id", Data : {},Code:300});
        } 
        else{
        data={
          password: user.Password,
        };
        let mail = await ForgotMailer.sendEmail(req.body.Email, "Password for VACALA","addUser", data);
        res.json({Status:"Success",Message:"Password has been sent to your registered Email Id", Data :{} ,Code:200});
       }    
  });
});

router.get('/getlist', function (req, res) {
        UserModel.find({}, function (err, users) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500}); 
             res.json({Status:"Success",Message:"Userdetail list", Data : users ,Code:200});     
        });
});


router.post('/edit', function (req, res) {
        CustomerModel.findByIdAndUpdate(req.body.User_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) returnres.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [],Code:404});
           }
           console.log("UpdatedDetails",UpdatedDetails);
             res.json({Status:"Success",Message:"User Details Updated", Data : UpdatedDetails ,Code:200});
        });
});



router.post('/delete', function (req, res) {
      UserModel.findByIdAndRemove(req.body.user_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Admin User Deleted successfully", Data : {} ,Code:200});
      });
});



////// Map Direction API ///////
router.post('/mobile/map/userdetails',  async function(req, res) {
    try{ 
       var CustomerVehicleData = await VehicleModel.find({Customer_id:req.body.Customer_id,Status:"Default"});
       var VehicletypeData = await Vehicle_TypeModel.find({});
       res.json({Status:"Success",Message:"Dashboard Data", VehicletypeDetails:VehicletypeData,CustomerVehicleData:CustomerVehicleData,Code:200}); 

  }
  catch(e){
       console.log(e)
       res.json({Status:"Failed",Message:"Internal server issue", Data :{},Code:500});
     }    
  });







router.post('/mobile/Dashboard',  async function(req, res) {
      try{
 
    var Homebanner = await HomebannerModel.find({});
       var Mobile_details = await mobileappdetailsModel.find({});
       var locationData = await Customer_LocationModel.findOne({Customer_id:req.body.Customer_id,Status:"Default"});
       var CustomerVehicleData = await VehicleModel.find({Customer_id:req.body.Customer_id,Status:"Default"});
       console.log(CustomerVehicleData)
       var VehicletypeData = await Vehicle_TypeModel.find({});
       var masterservices = await MasterServiceModel.find({Serviceavailable_Location:{ $in:locationData.City }});

       // Test Key
       // res.json({Status:"Success",salt_key:"eCwWELxi",merchant_key:"gtKFFx",isproduction : false ,Message:"Dashboard Data",MasterserviceList : masterservices, LocationDetails:locationData,HomeBannerList:Homebanner, VehicletypeDetails:VehicletypeData,CustomerVehicleData:CustomerVehicleData,Mobile_details:Mobile_details, Code:200}); 


       // Live Key
       // res.json({Status:"Success",salt_key:"g0nGFe03",merchant_key:"3TnMpV",isproduction : true ,Message:"Dashboard Data",MasterserviceList : masterservices, LocationDetails:locationData,HomeBannerList:Homebanner, VehicletypeDetails:VehicletypeData,CustomerVehicleData:CustomerVehicleData,Mobile_details:Mobile_details, Code:200}); 

       // Live Key 1
       res.json({Status:"Success",salt_key:"GvPcV8ei",merchant_key:"J4Pisp",isproduction : true ,Message:"Dashboard Data",MasterserviceList : masterservices, LocationDetails:locationData,HomeBannerList:Homebanner, VehicletypeDetails:VehicletypeData,CustomerVehicleData:CustomerVehicleData,Mobile_details:Mobile_details, Code:200}); 



  }
  catch(e){
       console.log(e)
       res.json({Status:"Failed",Message:"Internal server issue", Data :{},Code:500});
     }    
  });







module.exports = router;