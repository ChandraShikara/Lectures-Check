// models/pdfTranscriptionSchema.js
const mongoose = require('mongoose');

const pdfTranscriptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    pdf: { type: mongoose.Schema.Types.ObjectId, ref: 'PdfDetails', required: true }
});

const PdfTranscription = mongoose.model('PdfTranscription', pdfTranscriptionSchema);

module.exports = PdfTranscription;
