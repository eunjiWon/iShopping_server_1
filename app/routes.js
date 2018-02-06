var AuthenticationController = require('./controllers/authentication'), 
    TodoController = require('./controllers/todos'), 
    ImgController = require('./controllers/img'),
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');
 
var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});


let UPLOAD_PATH = '/opt/tensorflow-for-poets-2/uploads/';
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
 
    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        todoRoutes = express.Router();
        imgRoutes = express.Router(); 
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
    imgRoutes.get('/:user_id/images/:img_id/matching', ImgController.matching);

    // Set up routes
    app.use('/api', apiRoutes);
 
}
