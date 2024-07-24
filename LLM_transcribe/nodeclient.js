const axios = require('axios');
const fs = require('fs');

async function transcribeAudio(filePath) {
    try {
        const response = await axios.post('http://localhost:5000/transcribe', {
            file_path: filePath
        });

        console.log('Response:', aresponse.data);

        const { transcription } = response.data;
        console.log('Transcription:', transcription);

        // Save transcription to a text file
        fs.writeFileSync('transcription.txt', transcription, 'utf8');
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            console.error('Server responded with error:', error.response.data.error);
        } else if (error.code === 'ECONNRESET') {
            console.error('Connection reset by server. Check server logs or network issues.');
        } else {
            console.error('Error occurred:', error.message);
        }
    }
}

// Replace with your audio file path
const filePath = '1718354518462-PS2024-Sem2-Proj1.mp3';
transcribeAudio(filePath)