// models/SimilarityScore.js
const mongoose = require('mongoose');

const similarityScoreSchema = new mongoose.Schema({
    video_id: {
        type: String,
        required: true
    },
    pdf_id: {
        type: String,
        required: true
    },
    similarity_score: {
        type: Number,
        required: true
    }
});

const SimilarityScore = mongoose.model('SimilarityScore', similarityScoreSchema);

module.exports = SimilarityScore;
