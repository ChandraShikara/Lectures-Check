const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    videos: [{type:String}],
});

const media = mongoose.model('Media', MediaSchema);

module.exports = media;
