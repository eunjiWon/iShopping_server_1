var mongoose = require('mongoose');
 
var TodoSchema = new mongoose.Schema({
 
    title: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});
 
module.exports = mongoose.model('Todo', TodoSchema);
