/*
* Created on 2018.02.06
* @author: eunjiwon
*/
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
var passport = require('passport');
var router = require('./app/routes');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const del = require('del');
let UPLOAD_PATH = 'uploads/';
let PORT = 3000;

mongoose.connect('mongodb://localhost/iShopping');

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
router(app);
// listen (start app with node server.js) ======================================
app.listen(3000);
console.log("App listening on port 3000");
