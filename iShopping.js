/*
* Created on 2018.01.19
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
//const imageModule = require('./image');
const path = require('path');
const fs = require('fs');
const del = require('del');
let UPLOAD_PATH = 'uploads/';
let PORT = 3000;
/*
var PythonShell = require('python-shell');
        var options2 = {
                args: ['--graph=/opt/tensorflow-for-poets-2_1/tf_files/retrained_graph.pb', '--image=/opt/tensorflow-for-poets-2_1/tf_files/flower_photos/red/31.jpg'],
                scriptPath: '/opt/tensorflow-for-poets-2_1/scripts/'
        };
        PythonShell.run('label_image_1.py', options2, function (err, res) {
                if (err) {console.log("err is  " + err);}
                console.log("옷 색깔 분류 성공  : " + res);
        });

var options1 = {
	args: ['--graph=/opt/tensorflow-for-poets-2/tf_files/retrained_graph.pb', '--image=/opt/tensorflow-for-poets-2_1/tf_files/flower_photos/red/31.jpg'],       
	scriptPath: '/opt/tensorflow-for-poets-2/scripts'
};
PythonShell.run('label_image.py', options1, function (err, res) {
	if (err) {console.log("err is  " + err);}
	console.log("옷 형태 분류 성공	: " + res);
});
*/         
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
// passport module 사용하기 위해 
router(app);
// Models
var clothInf = mongoose.model('clothInf', {
    name: String,
    spot: String,
    price: Number
});

// Routes
 
    // Get reviews
    app.get('/history', function(req, res) {
        console.log("클라에서 get으로 들어왔다"); 
        // use mongoose to get all reviews in the database
        clothInf.find(function(err, result) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(result); // return all reviews in JSON format
        });
    });
 
    // create review and send back all reviews after creation
    app.post('/history', function(req, res) {
 
        console.log("클라에서 포스트로 받아서 디비 추가했어요");
 
        // create a review, information comes from request from Ionic
        clothInf.create({
            name : req.body.name,
            spot : req.body.spot,
            price: req.body.price,
            done : false
        }, function(err, res) {
            if (err)
                console.log("만드는데 " + err);  
            // get and return all the reviews after you create another
            clothInf.find(function(err, results) {
                if (err)
                    console.log("search " + err);
               // res.json(results);
            });
        });
 
    });
 
    // delete a review
    app.delete('/history/:_id', function(req, res) {
        clothInf.remove({
            _id : req.params._id
        }, function(err, review) {
 
        });
    });
 
/* camera part
//multer Settings for file upload

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, UPLOAD_PATH)
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-'+Date.now())
    }
})

let upload = multer ({ storage: storage})

module.exports = {
    UPLOAD_PATH: UPLOAD_PATH,
    PORT: PORT,
    upload: upload,
    app: app
};



// Get all uploaded images
app.get('/images', (req, res, next) => {
    // use lean() to get a plain JS object
    // remove the version key from the response
    imageModule.Image.find({}, '-__v').lean().exec((err, images) => {
        if (err) {
            res.sendStatus(400);
        }

        // Manually set the correct URL to each image
        for (let i = 0; i < images.length; i++) {
            var img = images[i];
            img.url = req.protocol + '://' + req.get('host') + '/images/' + img._id;
        }
        res.json(images);
    })
});


// Upload a new image with description
app.post('/images', upload.single('image'), (req, res, next) => {
    // Create a new image model and fill the properties
    let newImage = new imageModule.Image;
    newImage.filename = req.file.filename;
    newImage.originalName = req.file.originalname;
    newImage.desc = req.body.desc
    newImage.save(err => {
        if (err) {
            return res.sendStatus(400);
        }
        res.status(201).send({ newImage });
    });

})

// Get one image by its ID
app.get('/images/:id', (req, res, next) => {
    let imgId = req.params.id;
     imageModule.Image.findById(imgId, (err, image) => {
        if (err) {
            res.sendStatus(400);
        }
        // stream the image back by loading the file
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(UPLOAD_PATH, image.filename)).pipe(res);
    })
});

// Delete one image by its ID
app.delete('/images/:id', (req, res, next) => {
    let imgId = req.params.id;

     imageModule.Image.findByIdAndRemove(imgId, (err, image) => {
        if (err && image) {
            res.sendStatus(400);
        }
	console.log("delete: ", image);
        del([path.join(UPLOAD_PATH, image.filename)]).then(deleted => {
            res.sendStatus(200);
        })
    })
});
*/
 
// listen (start app with node server.js) ======================================
app.listen(3000);
console.log("App listening on port 3000");

