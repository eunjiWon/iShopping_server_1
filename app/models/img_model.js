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
    store: String,
    created: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);                                    
module.exports = {
	imageSchema: imageSchema,
	Image: Image
}
