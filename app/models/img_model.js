const mongoose = require('mongoose');

// Actual DB modelvar 
imageSchema = mongoose.Schema({
    filename: String,
    originalName: String,
    desc: String,
    userID: String,
    lat: Number,
    lng:  Number,
    color: String,
    shape: String,
    shape1: String,
    shape2: String,
    p: String,
    p1: String,
    p2: String,
    store: String,
    select_id: String,
    created: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);                                    
module.exports = {
	imageSchema: imageSchema,
	Image: Image
}
