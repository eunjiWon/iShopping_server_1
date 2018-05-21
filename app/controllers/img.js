var multer = require('multer');
var imageModule = require('../models/img_model');
var path = require('path');
var fs = require('fs');
var del = require('del');
var pardir = path.join(__dirname, '../../');
let UPLOAD_PATH = pardir+'uploads/';
let PORT = 3000;
var PythonShell = require('python-shell');
var clothShape, clothColor, cloth_id;
var select_id;
var cloth_name;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ObjectId = require('mongodb').ObjectId; 
//multer Settings for file upload
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, UPLOAD_PATH)
    },
    filename: function(req, file, cb){
        cb(null,  file.fieldname + '-' + Date.now());
    }
})
console.log(pardir);

let upload = multer ({ storage: storage})


exports.getAllUploadedImg = function(req, res, next){
     imageModule.Image.find({userID: req.params.user_id}, '-__v').lean().sort({created:-1}).exec((err, images) => {
    // imageModule.find({userID: req.params.user_id}, '-__v').lean().exec((err, images) => {
        if (err) {
            console.log("이미지 겟 fail1");
            res.sendStatus(400);
        }
        console.log("이미지 겟 성공1");
        // Manually set the correct URL to each image
        let user_id = req.params.user_id;
        for (let i = 0; i < images.length; i++) {
            var img = images[i];
            img.url = req.protocol + '://' + req.get('host') + '/api/users/' + user_id +'/images/' + img._id;
        }
        res.json(images);
    }) 
}
exports.getOneImgID = function(req, res, next){
    let imgId = req.params.img_id;
     imageModule.Image.findById(imgId, (err, image) => {
        if (err) {
            console.log("이미지 겟 fail2");
            res.sendStatus(400);
        }
        console.log("이미지 겟 성공2");
        // stream the image back by loding the file
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(UPLOAD_PATH, image.filename)).pipe(res);
    })
}
 
exports.uploadNewImg = function(req, res, next){
     // Create a new image model and fill the properties
    let newImage = new imageModule.Image;
    // tensorflow
    //option2 for color matching

    let options2 = {
        args: ['--graph='+pardir+'tf_files_color/retrained_graph.pb', 
                '--image='+pardir+'uploads/'+ req.file.filename,
                '--option_number=2'],
        scriptPath: pardir+'scripts/'
    };
    PythonShell.run('label_image.py', options2, function (err1, resu) {
         if (err1) {console.log("err is  " + err1);}
         console.log("옷 색깔 분류 성공  : ");
    });

    //option1 for category matching
    let options1 = {
        args: ['--graph=' + pardir + 'tf_files_category/retrained_graph.pb', 
                '--image=' + pardir + 'uploads/' + req.file.filename,
                '--option_number=1'],
        scriptPath: pardir+'scripts'
    };

    PythonShell.run('label_image.py', options1, function (err2, resu) {
        if (err2) {console.log("err is  " + err2);}
        console.log("옷 형태 분류 성공  : ");
        var lines = fs.readFileSync(pardir+"t.txt",'utf-8')
            .split('\n')
            .filter(Boolean);
        console.log(lines);
        
        //clothShape = fs.readFileSync(pardir+"t.txt");
        //clothColor = "red";
        clothColor = fs.readFileSync(pardir+"t1.txt");
        
        newImage.shape = lines[0].split(' ')[0];
        newImage.shape1 = lines[1].split(' ')[0];
        newImage.shape2 = lines[2].split(' ')[0]

        newImage.p = lines[0].split(' ')[1];
        newImage.p1 = lines[1].split(' ')[1];
        newImage.p2 = lines[2].split(' ')[1];

        newImage.color = clothColor;
        newImage.filename = req.file.filename;
        newImage.originalName = req.file.originalname;
        newImage.desc = req.body.desc;
        newImage.lat = req.body.lat;
        newImage.lng = req.body.lng;
        newImage.store = req.body.store;
        console.log("lat : " + req.body.lat);
        console.log("shape : " + newImage.shape + "  color : " + clothColor);
        newImage.userID = req.params.user_id;
        newImage.save(err3 => {
            if (err3) { 
                console.log("이미지 포스트(저장) fail" + err3);
                return res.sendStatus(400);
            }
            else{
                console.log("이미지 포스트(저장) 성공");
                //res.send(JSON.stringify(newImage));
                res.status(201).send({newImage});
                cloth_id = newImage._id;
                //console.log(cloth_id);
            }
        });
    });
}

exports.deleteOneImgID = function(req, res, next){
    let imgId = req.params.img_id;
    imageModule.Image.findByIdAndRemove(imgId, (err, image) => {
        if (err && image) {
            res.sendStatus(400);
        }
    console.log("delete: ", image);
        del([path.join(UPLOAD_PATH, image.filename)]).then(deleted => {
            res.sendStatus(200);
        })
    })
}

// match/:store_id
exports.match = function(req, res, next){
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("iShopping");
        var str_shape = clothShape.toString();
        var str_upper_color = clothColor.toString().toUpperCase();
        console.log("req.params.store_id " + req.params.store_id);
        dbo.collection("clothes").find({store_id: req.params.store_id, shape: str_shape, color: str_upper_color}).limit(6).toArray(function(err, result){
            console.log("req.params.store_id " + req.params.store_id);
            if (err) throw err;
            res.status(201).send(result);
            console.log("match list : " + JSON.stringify(result));
            db.close();
        });
   });    
}
// match/:select_id
exports.selectUpdate = function(req, res, next){
    select_id = req.params.select_id;
    console.log("select_id is : " + select_id);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("iShopping");
        dbo.collection("clothes").find({ _id: ObjectId(req.params.select_id)}).toArray(function(err, result) {
            if (err) throw err;
            cloth_name = result[0].name;
            imageModule.Image.update({ _id: ObjectId(cloth_id) }, { $set: { select_id: ObjectId(select_id), desc: cloth_name}}, function(err, res){
                if(err) throw err;
                console.log(res);
            });
            db.close(); 
        }); 
    });                                                             
}    








