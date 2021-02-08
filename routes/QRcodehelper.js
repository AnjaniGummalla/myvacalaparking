var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');  
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');
var QRCode = require('qrcode')
let BaseUrl = "https://myvacala.com";
var app = express();
app.use('/api/', express.static(path.join(__dirname, 'routes/public')));

exports.QRcode = async function (qrdata) {
   try{
//         var options = [color: {
//     dark: '#00F',  // Blue dots
//     light: '#0000' // Transparent background
//   }
// ];

  var filepath = __dirname + '/public/QRcodes/' + uuidv4() + '.png' ;

  var filename = path.basename(filepath);
console.log(filename);

        var Finalpath = BaseUrl +'/api/QRcodes/' + filename;

         return new Promise(async function (resolve, reject) {
          
                 await QRCode.toFile(filepath, qrdata, function(err, response) {
                    if (err){
                        console.log(err)
                        reject( false);
                    }
                    resolve(Finalpath);
                });
            });
         return Finalpath;
        //var html = pug.compileFile(layout, { pretty: true })(locals);
      }
      catch(e){
        console.log(e)
       return false;
      }
}
