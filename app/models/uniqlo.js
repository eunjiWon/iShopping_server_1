var mongoose = require('mongoose');

var UniqloSchema = new mongoose.Schema({
    name: String,
    price: Number,
    size: String,
    color: String,
    shape: String,
    url: String
});

module.exports = mongoose.model('Uniqlo', UniqloSchema);
