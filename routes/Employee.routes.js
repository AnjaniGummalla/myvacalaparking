var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var LocationModel = require('./../models/LocationModel');
var EmployeeModel = require('./../models/EmployeeModel');
var AccessModel = require('./../models/AccessModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{
    var EmployeeCheck = await EmployeeModel.findOne({Primary_Contact:req.body.Primary_Contact});
     if(EmployeeCheck != null){
           res.json({Status:"Failed",Message:"Mobile number already exists", Data : {},Code:300}); 
        }
        else{
          //     let fields = {
          //   "Role_Name": req.body.Role_Name || "",
          //   "Permissions":req.body.Permissions || "",
          //   "Employee_id": req.body.Employee_id || ""
          // }
          // var AccessDataaa = await AccessModel.create(fields);
          let employeefields = {
  Alternate_Contact: req.body.Alternate_Contact || "",

  Email_Id:  req.body.Email_Id || "",

  EmployeeAadharCard_file:  req.body.EmployeeAadharCard_file || "",

  EmployeeAadharCard_no:  req.body.EmployeeAadharCard_no || "",

  EmployeePanCard_file:  req.body.EmployeePanCard_file || "",

  EmployeePanCard_no: req.body.EmployeePanCard_no || "",

  Employee_Id:  req.body.Employee_Id || "",

  Employee_LastName:   req.body.Employee_LastName || "",

  Employee_Name:  req.body.Employee_Name || "",

  Location:  req.body.Location || "",

  Nomaniee_Name:  req.body.Nomaniee_Name || "",

  NomineeAadharCard_file:  req.body.NomineeAadharCard_file || "",

  NomineeAadharCard_no:  req.body.NomineeAadharCard_no || "",

  NomineeAddress:  req.body.NomineeAddress || "",

  NomineeMobileNumber:  req.body.NomineeMobileNumber || "",

  NomineePanCard_file:  req.body.NomineePanCard_file || "",

  NomineePanCard_no:  req.body.NomineePanCard_no || "",

  Permanentaddress: req.body.Permanentaddress || "",

  Permissions :  req.body.Permissions || "",

  Primary_Contact:  req.body.Primary_Contact || "",

  Role_Name:  req.body.Role_Name || "",

  Sector:  req.body.Sector || "",

  Temporaryaddress:  req.body.Temporaryaddress || "",

  OTP:  req.body.OTP || "",

  created_by :  req.body.created_by || "",

  employee_status : "Working",


  password : req.body.password,

  
          }
           var employeedetails = await EmployeeModel.create(employeefields); 
      
        res.json({Status:"Success",Message:"Added successfully", Data : employeedetails,Code:200});       
}
}
catch(e){
  console.log(e)
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/getlist', function (req, res) {
  
        EmployeeModel.find({}, function (err, Employeedetails) {
          res.json({Status:"Success",Message:"Employeedetails", Data : Employeedetails ,Code:200});
        }).populate('Location');
});



router.post('/admin_login', function (req, res) {
        EmployeeModel.findOne({Email_Id:req.body.Email_Id,password:req.body.password}, function (err, Employeedetails) {
        	console.log(Employeedetails);
        	if(Employeedetails == null){
        		res.json({Status:"Failed",Message:"Account Not Found", Data : {} ,Code:404});
        	}else{
        		res.json({Status:"Success",Message:"Employeedetails", Data : Employeedetails ,Code:200});
        	}
        }).populate('Location');
});





router.post('/inactivelist', async function (req, res) {
        await EmployeeModel.find({Employee_Status:req.body.Employee_Status}, async function (err, Employeedetails) {
          res.json({Status:"Success",Message:"Employee list", Data : Employeedetails ,Code:200});
        }).populate('PemissionsData');
});
router.post('/testactivelist', async function (req, res) {
      var employeedetails =  await EmployeeModel.find({Employee_Status:req.body.Employee_Status});
      for(i=0;i<employeedetails;i++){
        var dataaa =[];
        var permissiondetails = await AccessModel.find({Employee_id:employeedetails[i].Employee_Id});
        var finaldt = dataaa.push(permissiondetails)

        console.log(dataaa)
      }
          // for(var i=0;i<Employeedetails.length;i++){
          //  var AccessModeldata = await AccessModel.find({Employee_id:Employeedetails.Employee_id[i]})
          // }
          let data = {
            user:employeedetails,
            permissions:finaldt
          }
          res.json({Status:"Success",Message:"Employee list", Data : data ,Code:200});
});
router.post('/activelist', async function (req, res) {
        await EmployeeModel.find({Employee_Status:req.body.Employee_Status}, function (err, Employeedetails) {
          res.json({Status:"Success",Message:"Employee list", Data : Employeedetails ,Code:200});
        }).populate('PemissionsData');
});


router.post('/Dashboard', async function (req, res) {
        var Rolemanagentment = await EmployeeModel.find({}).getCount();
        var Bookings = await BookingsModel.find({}).getCount();
        let responseData ={
        	role: Rolemanagentment,
        	booking: Bookings
        }
        res.json({Status:"Success",Message:"Dashboard list", Data : responseData ,Code:200});
});


router.post('/edit', function (req, res) {
        EmployeeModel.findByIdAndUpdate(req.body.Employee_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) returnres.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Employeedetails Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.put('/statuschange', async function (req, res) {
        await EmployeeModel.findOneAndUpdate({Employee_Id:req.body.Employee_id},{Employee_Status:req.body.Employee_Status}, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == null){
              res.json({Status:"Failed",Message:"Unable to update the data", Data : {} ,Code:200});
             }
             res.json({Status:"Success",Message:"Employeedetails Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.put('/editpermissions', function (req, res) {
        PermissionModel.findOneAndUpdate(req.body.Employee_Email, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) returnres.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Employeedetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      EmployeeModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Employee Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      EmployeeModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Employees Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;