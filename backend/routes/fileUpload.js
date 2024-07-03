// fileUploadRoutes.js

const express = require("express");
const router = express.Router();
const Media = require("../models/mediaSchema");
const Audio = require("../models/audioSchema");
const path = require("path");
const PdfModel = require("../models/pdfSchema");
// const Transcription = require("../models/transcriptionSchema");
const upload = require("../models/MediaDetails"); // Correctly import the video upload config
const pdfUpload = require("../models/PdfDetails"); // Correctly import the PDF upload config
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { spawn } = require('child_process'); // For running the Python script
require('dotenv').config();

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

      // Save uploaded videos to the database
      const newMedia = new Media({
          name,
          videos: videoPaths
      });
      await newMedia.save();

      // Handle audio conversion and transcription for each uploaded video
      for (const file of req.files) {
          const videoFullPath = path.join(__dirname, '..', 'uploads', file.filename);
          const audioOutputPath = path.join(__dirname, '..', 'audios', `${path.basename(file.filename, path.extname(file.filename))}.mp3`);
          const transcriptionOutputPath = path.join(__dirname, '..', 'transcriptions', `${path.basename(file.filename, path.extname(file.filename))}.txt`);

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

          // Call Python script to transcribe audio
          const pythonProcess = spawn('python', ['transcribe_audio.py', audioOutputPath]);

          pythonProcess.stdout.on('data', async (data) => {
              console.log(`Transcription result: ${data}`);
              const transcriptionText = data.toString().trim();

              // Save transcription to a text file
              fs.writeFileSync(transcriptionOutputPath, transcriptionText);
              console.log(`Transcription saved to ${transcriptionOutputPath}`);

              // Store audio and transcription in the database
              const audio = new Audio({
                  title: name,
                  audioFile: {
                      data: audioData,
                      contentType: 'audio/mpeg' // Set the appropriate content type
                  },
                  transcription: transcriptionText, // Store the transcription text
                  media: newMedia._id // Provide the ID of the corresponding media entry
              });
              await audio.save();
          });

          pythonProcess.stderr.on('data', (data) => {
              console.error(`Error during transcription: ${data}`);
          });

          pythonProcess.on('close', (code) => {
              console.log(`Python process exited with code ${code}`);
          });
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
