var createError = require('http-errors'); 
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var fileUpload = require('express-fileupload');
var logger = require('morgan');
var cmd = require('node-cmd');
var cors = require('cors');
var bodyParser = require('body-parser');
var tc =require("time-slots-generator");
const Excel = require('exceljs');
var https = require('https');
const jwt = require('jsonwebtoken');

require('dotenv').config({path: path.join(__dirname, "./.env")});


var usersRouter = require('./routes/User.routes');
var parking_new_pricingRouter = require('./routes/Parking_pricing_new')
var DriverRouter = require('./routes/Driver.routes');
var MechanicRouter = require('./routes/Mechanic.routes');
var VehicleRouter = require('./routes/Vehicle.routes');
var ServiceRouter = require('./routes/services.routes');
var SubserviceRouter = require('./routes/Subservice.routes');
var CustomerRouter = require('./routes/Customer.routes');
var BookingRouter = require('./routes/Mechanicbooking.routes');
var LocationRouter = require('./routes/Location.routes');

var ParkingLocationRouter = require('./routes/Parkinglocations.routes');


var VehicletypeRouter = require('./routes/Vehicletype.routes');
var DriverBookingRouter = require('./routes/Driverbooking.routes')

var MechanicwebRouter = require('./routes/mechanicweb.routes');
var PaymentRouter = require('./routes/Payment.routes');
var RoleRouter = require('./routes/Role.routes');
var MasterserviceRouter = require('./routes/Masterservices.routes')
var EmployeeRouter = require('./routes/Employee.routes');
var EstimationRouter = require('./routes/Estimation.routes');
var PickupboyRouter = require('./routes/pickup.routes');
var VehiclebrandRouter = require('./routes/vehiclebrand.routes');
var HomebannerRouter = require('./routes/Homebanner.routes');

var ActivityRouter = require('./routes/Activity.routes');
var VehicleNameRouter = require('./routes/VehicleName.routes');
var FuelTypeRouter = require('./routes/Fueltype.routes');
var VehicleModelRouter = require('./routes/vehiclemodel.routes')
var CartRouter = require('./routes/Cart.routes');
var NotificationRouter = require('./routes/Notification.routes');
var FAQRouter =  require('./routes/FAQ.routes');
var CouponsRouter =  require('./routes/Coupons.routes');
var PopularServiceRouter =  require('./routes/popularservices.routes');
var PopularSubServiceRouter =  require('./routes/popularsubservices.routes');
var MobilesplashscreenRouter = require('./routes/mobilesplashscreen.routes');
var mobileappdetailsRouter = require('./routes/mobileappdetails.routes');

///Parking Vendor Details///
var Parking_Owner_Router = require('./routes/parking_owner.routes');
var Parking_Details_Router = require('./routes/parking_details.routes');
var Parking_Pricing_Router = require('./routes/parking_pricing.routes');
var Parking_booking_Router = require('./routes/parkingbooking.routes');
var Parking_Vendorlist_Router = require('./routes/Parking_vendorlist.routes');
var Parking_Booking_New_Router = require('./routes/Parking_Booking_new');


var QRCode = require('qrcode')
var ServiceBannerRouter =  require('./routes/ServicesBanner.routes');
var schedule = require('node-schedule');
var mongoXlsx = require('mongo-xlsx');
/* DB connectivity */
const mongoose = require('mongoose'); 
mongoose.connect('mongodb+srv://myvacalaparking:myvacalaparking@cluster0.voivj.mongodb.net/myvacala?retryWrites=true&w=majority'); 
var db = mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 

var app = express();
app.use(cors());
app.use(fileUpload());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type,Content-Length, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/',express.static(path.join(__dirname, 'public')));
app.use('/',express.static(path.join(__dirname, 'routes/public')));
app.use('/', usersRouter);
app.use('/driver', DriverRouter);
app.use('/mechanic', MechanicRouter);
app.use('/vehicle', VehicleRouter);
app.use('/service', ServiceRouter);
app.use('/subservice',SubserviceRouter);
app.use('/customer',CustomerRouter);
app.use('/booking',BookingRouter);
app.use('/location',LocationRouter);

app.use('/parkinglocation',ParkingLocationRouter);
app.use('/parkingpricing',Parking_Pricing_Router);


app.use('/vehicletype',VehicletypeRouter);
app.use('/driverbooking',DriverBookingRouter);

app.use('/mechanicweb',MechanicwebRouter);
app.use('/payment',PaymentRouter);
app.use('/employee',EmployeeRouter);
app.use('/role',RoleRouter);
app.use('/estimation',EstimationRouter);
app.use('/masterservices',MasterserviceRouter);
app.use('/pickupboy',PickupboyRouter);
app.use('/vehiclebrand',VehiclebrandRouter);
app.use('/homebanner',HomebannerRouter);

app.use('/vehiclename',VehicleNameRouter);
app.use('/activity',ActivityRouter);
app.use('/fuel',FuelTypeRouter);
app.use('/vehiclemodel',VehicleModelRouter);
app.use('/cart',CartRouter);
app.use('/notification',NotificationRouter);
app.use('/faq',FAQRouter);
app.use('/coupons',CouponsRouter);
app.use('/popularservices',PopularServiceRouter);
app.use('/popularsubservices',PopularSubServiceRouter);
app.use('/servicebanner',ServiceBannerRouter);
app.use('/mobilesplashscreen',MobilesplashscreenRouter);
app.use('/mobileappdetails',mobileappdetailsRouter);


/////Parking Vendor///////
app.use('/parking/owner',Parking_Owner_Router);
app.use('/parking/pricing',parking_new_pricingRouter)
app.use('/parking/parkingareadetails',Parking_Details_Router);
app.use('/parking/parkingbooking',Parking_booking_Router);
app.use('/parking/vendorlist',Parking_Vendorlist_Router);
app.use('/parking/booking',Parking_Booking_New_Router);



console.log("get me all the time slots of the day with time \n",tc.getTimeSlots([],false));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


let BaseUrl = "https://myvacala.com/api/";


app.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;

  console.log('asdfasdfasdfasdf');

  if (!req.files || Object.keys(req.files).length === 0) {
    res.json({Status:"Failed",Message:"No files found", Data :{},Code:300});
    return;
  }

  console.log('req.files >>>', req.files); // eslint-disable-line

  sampleFile = req.files.sampleFile;

  uploadPath = __dirname + '/public/uploads/' + sampleFile.name;

  var Finalpath =  BaseUrl +'/uploads/'+ sampleFile.name;
   console.log("uploaded path",uploadPath );

  sampleFile.mv(uploadPath, function(err) {
    if (err) {
   console.log(err)
   //return res.json({Status:"Failed",Message:"Internal Server Error", Data :{},Code:300});
    }
   return res.json({Status:"Success",Message:"file upload success", Data :Finalpath,Code:200});
  });
});

// QRCode.toFile('./filename.png', 'Some text', {
//   color: {
//     dark: '#00F',  // Blue dots
//     light: '#0000' // Transparent background
//   }
// }, function (err) {
//   if (err) throw err
//   console.log('done')
// })

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
