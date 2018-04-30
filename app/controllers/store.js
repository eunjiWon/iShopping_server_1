var ObjectId = require('mongodb').ObjectId; 
// api/stores/:store_id
exports.findStore = function(req, res, next){
console.log("api/stores/:store_id 로 들어온다.");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("iShopping");
    console.log("!!!!!!store_id is " + req.params.store_id);
    dbo.collection("store").find({ _id: ObjectId(req.params.store_id)}).toArray(function(err, result)     {
        if (err) throw err;
        console.log("store_id Info is  :  " + JSON.stringify(result));
        res.status(201).send(JSON.stringify(result));
        db.close();
        });
    });
}
