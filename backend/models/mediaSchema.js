// models/mediaSchema.js
const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    videos: [{ type: String }],
    transcriptionText: { type: String } // Add this field to store the transcription text
});

const Media = mongoose.model('Media', MediaSchema);
module.exports = Media;
