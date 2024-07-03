const express = require("express");
const router = express.Router();
const Media = require("../models/mediaSchema");
const Audio = require("../models/audioSchema");
const path = require("path");
const PdfModel = require("../models/pdfSchema");
const Transcription = require("../models/transcriptionSchema");
const upload = require("../models/MediaDetails"); // Correctly import the video upload config
const pdfUpload = require("../models/PdfDetails"); // Correctly import the PDF upload config
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

// Set the AssemblyAI API key
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

// Endpoint to retrieve all media
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

        // Save uploaded videos to the database
        const newMedia = new Media({
            name,
            videos: videoPaths
        });
        await newMedia.save();

        // Process each uploaded video for transcription
        for (const videoPath of videoPaths) {
            const videoFullPath = path.join(__dirname, '..', videoPath);

            // Convert video to audio
            const audioOutputPath = `audios/${path.basename(videoPath, path.extname(videoPath))}.mp3`;
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

            const audioData = fs.readFileSync(audioOutputPath);

            // Store audio and metadata in the database
            const audio = new Audio({
                title: name,
                audioFile: {
                    data: audioData,
                    contentType: 'audio/mpeg' // Set the appropriate content type
                },
                media: newMedia._id // Provide the ID of the corresponding media entry
            });
            await audio.save();


            // Upload audio file to AssemblyAI
            const audioFile = fs.createReadStream(audioOutputPath);
            const formData = new FormData();
            formData.append('audio', audioFile);

            const response = await axios.post('https://api.assemblyai.com/v2/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${ASSEMBLYAI_API_KEY}`,
                    ...formData.getHeaders()
                }
            });

            const audioUrl = response.data.upload_url;

            // Transcribe audio to text
            const transcriptResponse = await axios.post('https://api.assemblyai.com/v2/transcript', {
                audio_url: audioUrl
            }, {
                headers: {
                    'Authorization': `Bearer ${ASSEMBLYAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const transcriptId = transcriptResponse.data.id;

            // Wait for transcription to complete
            let transcript;
            while (true) {
                const statusResponse = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
                    headers: {
                        'Authorization': `Bearer ${ASSEMBLYAI_API_KEY}`
                    }
                });
                if (statusResponse.data.status === 'completed') {
                    transcript = statusResponse.data.text;
                    break;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before checking again
                }
            }

            // Write transcript to text file
            const textOutputPath = `transcriptions/${path.basename(videoPath, path.extname(videoPath))}.txt`;
            fs.writeFileSync(textOutputPath, transcript);

            // Save transcription data to the database
            // Save transcription data to the database
            const newTranscription = new Transcription({
                text: transcript, // Provide the transcript text here
                audio: audioOutputPath,
                media: newMedia._id, // Provide the ID of the corresponding media entry
                videoPath,
                textPath: textOutputPath
            });
            await newTranscription.save();


        }

        res.json(newMedia);
    } catch (err) {
        console.error('Error in /api/v1/media/upload route:', err);
        res.status(500).send('Server Error');
    }
});

router.post("/upload-files", pdfUpload.single("file"), async (req, res) => {
    console.log("File upload request received");
    console.log("Uploaded file:", req.file);
    const title = req.body.title;
    const fileName = req.file.filename;
    try {
        await PdfModel.create({ title: title, pdf: fileName });
        console.log("File saved to database:", fileName);
        res.send({ status: "ok" });
    } catch (error) {
        console.error("Error saving file to database:", error);
        res.json({ status: error });
    }
});

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
