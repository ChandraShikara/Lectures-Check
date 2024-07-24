from flask import Flask, request, jsonify
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from sentence_transformers import SentenceTransformer, util
import librosa
import os
import torch
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS


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
