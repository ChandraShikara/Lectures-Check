const express = require("express");
const router = express.Router();
const Media = require("../models/mediaSchema");
const Audio = require("../models/audioSchema");
const Transcription = require("../models/transcriptionSchema");
const PdfModel = require("../models/pdfSchema");
const PdfTranscription = require("../models/pdfTranscriptionSchema");
const path = require("path");
const upload = require("../models/MediaDetails");
const pdfUpload = require("../models/PdfDetails");
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const PDFParser = require('pdf-parse');
require('dotenv').config();

ffmpeg.setFfmpegPath('C:/Users/Dell/OneDrive/Desktop/ffmpeg/bin/ffmpeg.exe'); 

// Multer setup for file storage
router.get("/api/v1/media/all", async (req, res) => {
    try {
        const medias = await Media.find();
        res.json(medias);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Endpoint to upload media and handle transcription

router.post('/api/v1/media/upload', upload.array('videos', 12), async (req, res) => {
    try {
        const { name } = req.body;
        const videoPaths = req.files.map(file => `/uploads/${file.filename}`);
        const newMedia = new Media({ name, videos: videoPaths });

        for (const file of req.files) {
            const videoFullPath = path.join(__dirname, '..', 'uploads', file.filename);
            const audioOutputPath = path.join(__dirname, '..', 'audios', `${path.basename(file.filename, path.extname(file.filename))}.mp3`);
            const transcriptionOutputPath = path.join(__dirname, '..', 'transcriptions', `${path.basename(file.filename, path.extname(file.filename))}.txt`);

            // Convert video to audio
            await new Promise((resolve, reject) => {
                ffmpeg(videoFullPath)
                    .audioBitrate(128)
                    .on('error', (err) => {
                        console.error('Error during audio conversion:', err);
                        reject(err);
                    })
                    .on('end', () => {
                        console.log('Audio conversion complete.');
                        resolve();
                    })
                    .save(audioOutputPath);
            });

            // Read audio data
            const audioData = fs.readFileSync(audioOutputPath);

            try {
                // Transcribe audio
                const response = await axios.post('http://localhost:5001/transcribe', { file_path: audioOutputPath });
                const { transcription } = response.data;

                // Save transcription to file
                fs.writeFileSync(transcriptionOutputPath, transcription, 'utf8');
                console.log(`Transcription saved to ${transcriptionOutputPath}`);

                // Save audio and transcription documents
                const audio = new Audio({
                    title: name,
                    audioFile: { data: audioData, contentType: 'audio/mpeg' },
                    media: newMedia._id
                });
                await audio.save();

                const transcriptionDoc = new Transcription({
                    text: transcription,
                    audio: audio._id,
                    media: newMedia._id
                });
                await transcriptionDoc.save();

                audio.transcription = transcriptionDoc._id;
                await audio.save();

                // Add transcription text to Media schema
                newMedia.transcriptionText = transcription;
            } catch (error) {
                console.error('Error calling /transcribe:', error);
                throw error;
            }
        }

        await newMedia.save(); // Save the media with transcription text

        res.json({ videoId: newMedia._id, status: 'ok' }); // Send videoId in response
    } catch (err) {
        console.error('Error in /api/v1/media/upload route:', err);
        res.status(500).send('Server Error');
    }
});

router.post('/upload-files', pdfUpload.single('file'), async (req, res) => {
    console.log('File upload request received');
    console.log('Uploaded file:', req.file);
    const title = req.body.title;
    const fileName = req.file.filename;
    const pdfPath = path.join(__dirname, '..', 'files', fileName);
    const outputPath = path.join(__dirname, '..', 'pdftranscriptions', `${path.basename(fileName, path.extname(fileName))}.txt`);

    try {
        // Create PdfModel document
        const pdfDoc = await PdfModel.create({ title: title, pdf: fileName });
        
        // Extract text from PDF
        const transcriptionText = await extractTextFromPDF(pdfPath);
        console.log('File and transcription saved successfully:', fileName);

        // Save transcription text to PdfModel schema
        pdfDoc.transcriptionText = transcriptionText;
        await pdfDoc.save();

        // Save transcription text to PdfTranscription schema
        const pdfTranscription = new PdfTranscription({
            text: transcriptionText,
            pdf: pdfDoc._id
        });
        await pdfTranscription.save();

        // Save transcription text to file
        fs.writeFileSync(outputPath, transcriptionText, 'utf8');
        console.log(`PDF transcription saved to ${outputPath}`);

        // Send the response with pdfId
        res.send({ status: 'ok', pdfId: pdfDoc._id });
    } catch (error) {
        console.error('Error saving file or transcription to database:', error);
        res.json({ status: 'error', error: error.message });
    }
});

async function extractTextFromPDF(pdfPath) {
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const pdf = await PDFParser(dataBuffer);
        return pdf.text;
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw error;
    }
}

router.get("/get-files", async (req, res) => {
    console.log("Get files request received");
    try {
        const data = await PdfModel.find({});
        console.log("Files retrieved from database:", data);
        res.send({ status: "ok", data: data });
    } catch (error) {
        console.error("Error retrieving files from database:", error);
        res.json({ status: error });
    }
});



module.exports = router;
