    const mongoose = require('mongoose');

    const AudioSchema = new mongoose.Schema({
        title: { type: String, required: true },
        audioFile: { data: Buffer, contentType: String }, // Store audio as Buffer data
        transcription: { type: mongoose.Schema.Types.ObjectId, ref: 'Transcription' }
    });

    const Audio = mongoose.model('Audio', AudioSchema);
    module.exports = Audio;
