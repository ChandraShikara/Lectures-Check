from flask import Flask, request, jsonify
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from sentence_transformers import SentenceTransformer, util
import librosa
import os
import torch
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load models
processor = WhisperProcessor.from_pretrained("openai/whisper-tiny.en")
model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-tiny.en")
sentence_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')  # Load SentenceTransformer model

@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    if 'file_path' not in request.json:
        return jsonify({"error": "Missing file_path parameter"}), 400

    file_path = request.json['file_path']
    
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    audio, _ = librosa.load(file_path, sr=16000)
    input_features = processor(audio, sampling_rate=16000, return_tensors="pt").input_features
    predicted_ids = model.generate(input_features)
    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

    return jsonify({"transcription": transcription})


@app.route('/compute_similarity', methods=['POST'])
def compute_similarity():
    data = request.json
    text1 = data.get('text1')
    text2 = data.get('text2')

    if not text1 or not text2:
        return jsonify({'error': 'Both text1 and text2 are required'}), 400

    embeddings = sentence_model.encode([text1, text2], convert_to_tensor=True)
    cosine_score = util.pytorch_cos_sim(embeddings[0], embeddings[1])
    similarity = cosine_score.item()

    return jsonify({'similarity': similarity})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
