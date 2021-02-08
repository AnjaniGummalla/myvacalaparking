var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var PermissionSchema = new mongoose.Schema({   
  
  Dashboard: Number,

  Role_Management: Number,

  Vendor_Onboarding_Mechanic: Number,

  Vendor_Onboarding_Parking: Number,

  Vendor_Onboarding_Driver: Number,

  Vendor_List_Mechanic: Number,

  Vendor_List_Parking: Number,

  Vendor_List_Driver: Number,

  Vendor_Booking_Mechanic: Number,

  Vendor_Booking_Parking: Number,

  Vendor_Booking_Driver: Number,

  Vendor_BookingList_Mechanic: Number,

  Vendor_BookingList_Parking: Number,

  Vendor_BookingList_Driver: Number,

  App_Management: Number,

  Finance: Number,

  CustomerCare: Number,

  Statatics: Number,

  Operations: Number,

  Primary_Contact: Number,

});
PermissionSchema.plugin(timestamps);

mongoose.model('Permission', PermissionSchema);

module.exports = mongoose.model('Permission');