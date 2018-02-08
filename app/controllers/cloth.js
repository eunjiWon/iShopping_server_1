var ObjectId = require('mongodb').ObjectId; 
// api/stores/:store_id/clothes/:store_id/:store_select_id
exports.findCloth = function(req, res, next){
    console.log("api/stores/:store_id/clothes/:store_select_id 로 들어온다.");
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("iShopping");
        dbo.collection("clothes").find({store_id: req.params.store_id, _id: ObjectId(req.params.store_select_id)}).toArray(function(err, result) {
            if (err) throw err;
            console.log("store_select_id is : " + req.params.store_select_id);
            console.log("store_select_cloth_info is  :  " + JSON.stringify(result));
            res.status(201).send(JSON.stringify(result));
            db.close();
        });
   });    
}
// api/stores
exports.findStore = function(req, res, next){
    console.log("api/stores 로 들어온다.");
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("iShopping");
        dbo.collection("storeInfo").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log("storeInfo is  :  " + JSON.stringify(result));
            res.status(201).send(JSON.stringify(result));
            db.close();
        });
   });    
}









