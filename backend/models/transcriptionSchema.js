const mongoose = require('mongoose');

const TranscriptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    audio: { type: String, required: true } // Change the type to String for storing the audio file path or filename
});

const Transcription = mongoose.model('Transcription', TranscriptionSchema);
module.exports = Transcription;
