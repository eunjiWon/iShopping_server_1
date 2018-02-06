var Uniqlo = require('../models/uniqlo');
var multer = require('multer');
var imageModule = require('../models/img_model');
var path = require('path');
var fs = require('fs');
var del = require('del');
let UPLOAD_PATH = '/opt/tensorflow-for-poets-2/uploads/';
let PORT = 3000;
var PythonShell = require('python-shell');
var clothShape, clothColor;
//multer Settings for file upload
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, UPLOAD_PATH)
    },
    filename: function(req, file, cb){
        cb(null,  file.fieldname + '-' + Date.now());
    }
})

let upload = multer ({ storage: storage})


exports.getAllUploadedImg = function(req, res, next){
     imageModule.Image.find({userID: req.params.user_id}, '-__v').lean().exec((err, images) => {
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
    // 텐서플로우 
    let options2 = {
        args: ['--graph=/opt/tensorflow-for-poets-2_1/tf_files/retrained_graph.pb', '--image=/opt/tensorflow-for-poets-2/uploads/'+ req.file.filename],
        scriptPath: '/opt/tensorflow-for-poets-2_1/scripts/'
    };
    PythonShell.run('label_image_1.py', options2, function (err1, resu) {
         if (err1) {console.log("err is  " + err1);}
         console.log("옷 색깔 분류 성공  : ");
    });
    let options1 = {
        args: ['--graph=/opt/tensorflow-for-poets-2/tf_files/retrained_graph.pb', '--image=/opt/tensorflow-for-poets-2/uploads/' + req.file.filename],
        scriptPath: '/opt/tensorflow-for-poets-2/scripts'
    };
    PythonShell.run('label_image.py', options1, function (err2, resu) {
        if (err2) {console.log("err is  " + err2);}
        console.log("옷 형태 분류 성공  : ");
        clothShape = fs.readFileSync("/opt/tensorflow-for-poets-2/t.txt");
        clothColor = fs.readFileSync("/opt/tensorflow-for-poets-2/t1.txt");
        newImage.color = clothShape;
        newImage.shape = clothColor;
        newImage.filename = req.file.filename;
        newImage.originalName = req.file.originalname;
        newImage.desc = req.body.desc;
        newImage.lat = req.body.lat;
        newImage.lng = req.body.lng;
        newImage.store = req.body.store;
        console.log("lat : " + req.body.lat);//
        console.log("shape : " + clothShape + "  color : " + clothColor);//
        newImage.userID = req.params.user_id;
        newImage.save(err3 => {
            if (err3) { 
                console.log("이미지 포스트(저장) fail" + err3);
                return res.sendStatus(400);
            }
            else{
                console.log("이미지 포스트(저장) 성공");
                res.status(201).send({ newImage });
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
// matching limit 5 
exports.matching = function(req, res, next){
    Uniqlo.find({shape: clothShape, color: clothColor}, {limit: 5}, function(err, res){
        if(err) throw err;
        else{
            if(res.length == 0) console.log("no information");
            else{
                console.log(res);
                //res.send(res);
            } 
        }
    })
}



