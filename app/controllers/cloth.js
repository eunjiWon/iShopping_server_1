var ObjectId = require('mongodb').ObjectId; 
var Shape, Color;
// api/clothes/:select_id
exports.findCloth = function(req, res, next){
    console.log("api/clothes/:select_id 로 들어온다.");
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("iShopping");
        dbo.collection("clothes").find({ _id: ObjectId(req.params.select_id)}).toArray(function(err, result) {
            if (err) throw err;
            console.log("select_id is : " + req.params.select_id);
            console.log("select_cloth_info is  :  " + JSON.stringify(result));
            res.status(201).send(JSON.stringify(result));
            db.close();
        });
   });    
}
//api/clothes/:select_id/recommend/:choice
exports.recommend = function(req, res, next){
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    var choice = req.params.choice;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("iShopping");
        dbo.collection("clothes").find({ _id: ObjectId(req.params.select_id)}).toArray(function(err, result) {
            if(err) throw err;
            Shape = result[0].shape;
            Color = result[0].color;
            console.log("shape is : " + Shape);
            console.log("color is : " + Color);
        })
        if(choice == 1){
            dbo.collection("clothes").find({shape: Shape}).limit(6).toArray(function(err, r1){
                if (err) throw err;
                res.status(201).send(r1);
                console.log("shape recommend list : " + JSON.stringify(r1));
            })
        }
        else if(choice == 2){
            dbo.collection("clothes").find({color: Color}).limit(6).toArray(function(err, r2){
                if (err) throw err;
                res.status(201).send(r2);
                console.log("color recommend list : " + JSON.stringify(r2));
            })
        }
        else if(choice == 3){
            dbo.collection("clothes").find({shape: Shape, color: Color}).limit(6).toArray(function(err, r3){
                if (err) throw err;
                res.status(201).send(r3);
                console.log("both recommend list : " + JSON.stringify(r3));
            })
        }
        else;
        
        db.close();
     })
}








