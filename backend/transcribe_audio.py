# transcribe_audio.py
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import librosa

# Load model and processor
processor = WhisperProcessor.from_pretrained("openai/whisper-tiny.en")
model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-tiny.en")

def load_audio(file_path):
    audio, sampling_rate = librosa.load(file_path, sr=16000)  # Load and resample to 16kHz
    return audio, sampling_rate

def chunk_audio(audio, chunk_length=30):
    sampling_rate = 16000
    chunk_length_samples = chunk_length * sampling_rate
    return [audio[i:i + chunk_length_samples] for i in range(0, len(audio), chunk_length_samples)]

def transcribe_audio(file_path, output_path):
    audio, sampling_rate = load_audio(file_path)
    audio_chunks = chunk_audio(audio)

    full_transcription = []

    for chunk in audio_chunks:
        input_features = processor(chunk, sampling_rate=sampling_rate, return_tensors="pt").input_features
        predicted_ids = model.generate(input_features, max_length=1024)
        transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
        full_transcription.append(transcription)

    final_transcription = " ".join(full_transcription)
    
    with open(output_path, "w") as f:
        f.write(final_transcription)

    return final_transcription
