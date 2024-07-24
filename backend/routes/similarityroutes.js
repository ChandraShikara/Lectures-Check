const express = require("express");
const router = express.Router();
const Media = require("../models/mediaSchema");
const PdfModel = require("../models/pdfSchema");
const SimilarityScore = require("../models/SimilarityScore");
const axios = require('axios');

router.get('/api/v1/similarity', async (req, res) => {
    const { video_id, pdf_id } = req.query;
    console.log('Received video_id:', video_id);
    console.log('Received pdf_id:', pdf_id);

    if (!video_id || !pdf_id) {
        return res.status(400).json({ error: 'Missing video_id or pdf_id' });
    }

    try {
        const media = await Media.findById(video_id).exec();
        if (!media || !media.transcriptionText) {
            return res.status(404).json({ error: 'Video transcription not found.' });
        }
        const videoText = media.transcriptionText;

        const pdf = await PdfModel.findById(pdf_id).exec();
        if (!pdf || !pdf.transcriptionText) {
            return res.status(404).json({ error: 'PDF transcription not found.' });
        }
        const pdfText = pdf.transcriptionText;

        // Calculate similarity score
        const similarityScore = await calculateSimilarity(videoText, pdfText);
        console.log(similarityScore);

        // Save the similarity score to the database
        await SimilarityScore.create({
            video_id: video_id,
            pdf_id: pdf_id,
            similarity_score: similarityScore
        });

        // Send the response
        res.json({
            video_text: videoText,
            pdf_text: pdfText,
            similarity_score: similarityScore
        });
    } catch (error) {
        console.error('Error fetching or saving similarity score:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

async function calculateSimilarity(videoText, pdfText) {
    try {
        const response = await axios.post('http://localhost:5001/compute_similarity', {
            text1: videoText,
            text2: pdfText
        });
        return response.data.similarity;
    } catch (error) {
        console.error('Error calculating similarity:', error);
        throw error;
    }
}

module.exports = router;
