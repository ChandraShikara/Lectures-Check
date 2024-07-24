const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transcriptionSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    audio: {
        type: Schema.Types.ObjectId,
        ref: 'Audio'
    },
    media: {
        type: Schema.Types.ObjectId,
        ref: 'Media'
    }
});

const Transcription = mongoose.model('Transcription', transcriptionSchema);
module.exports = Transcription;
