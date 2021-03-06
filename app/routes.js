var AuthenticationController = require('./controllers/authentication'), 
    ImgController = require('./controllers/img'),
    ClothController = require('./controllers/cloth'),
    StoreController = require('./controllers/store'),
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');
 
var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});


let UPLOAD_PATH = '/home/ubuntu/iShopping_server_1/uploads/';
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, UPLOAD_PATH)
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-'+Date.now())
    }
});
let upload = multer ({ storage: storage});
 
module.exports = function(app){
 
    var apiRoutes = express.Router();
    var authRoutes = express.Router();
    var imgRoutes = express.Router(); 
    var clothRoutes = express.Router();
    var storeRoutes = express.Router();
    // Auth Routes
    apiRoutes.use('/auth', authRoutes);
 
    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);
 
    authRoutes.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });
 
    // Img Routes
    apiRoutes.use('/users', imgRoutes);

    imgRoutes.get('/:user_id/images', ImgController.getAllUploadedImg);
    imgRoutes.get('/:user_id/images/:img_id', ImgController.getOneImgID);
    imgRoutes.post('/:user_id/images',upload.single('image'), ImgController.uploadNewImg);
    imgRoutes.delete('/:user_id/images/:img_id', ImgController.deleteOneImgID);
    //matching
    imgRoutes.get('/:user_id/match/:store_id', ImgController.match);
    imgRoutes.post('/:user_id/match/:select_id', ImgController.selectUpdate);
   
    // Cloth Routes
    apiRoutes.use('/clothes', clothRoutes);
    // find store select cloth
    clothRoutes.get('/:select_id', ClothController.findCloth);
    clothRoutes.get('/:select_id/recommend/:choice', ClothController.recommend); // 이건 뭐지?
    
    // Store Routes
    apiRoutes.use('/stores', storeRoutes);
    // find store name
    storeRoutes.get('/:store_id', StoreController.findStore);
    // Set up routes
    app.use('/api', apiRoutes);
 
}
