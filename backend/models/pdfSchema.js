// models/pdfSchema.js
const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    title: { type: String, required: true },
    pdf: { type: String, required: true },
    transcriptionText: { type: String } // Add this field to store the transcription text
});

const PdfModel = mongoose.model('PdfDetails', pdfSchema);
module.exports = PdfModel;
