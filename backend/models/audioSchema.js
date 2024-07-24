// models/audioSchema.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const audioSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    audioFile: {
        data: Buffer,
        contentType: String
    },
    transcription: {
        type: Schema.Types.ObjectId,
        ref: 'Transcription'
    },
    media: {
        type: Schema.Types.ObjectId,
        ref: 'Media'
    }
});

module.exports = mongoose.model('Audio', audioSchema);
