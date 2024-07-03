const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
    title: { type: String, required: true },
    pdf: { type: String, required: true }
});

const PdfModel = mongoose.model("pdfDetails", pdfSchema);

module.exports = PdfModel;
