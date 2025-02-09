import openai
import os
import pygame
from flask import Flask, request, jsonify

app = Flask(__name__)

TOGETHER_API_KEY = "4415612823b21a11bf0d1db36d686a0e9ca7ba683058f874d35c60be0eb083d1"
openai.api_key = os.getenv("TOGETHER_API_KEY", TOGETHER_API_KEY)
openai.api_base = "https://api.together.xyz/v1"
MODEL_NAME = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K"

pygame.mixer.init()

AUDIO_FILE = "./yeahbaby.mp3"

def play_yeah_baby():
    try:
        pygame.mixer.music.load(AUDIO_FILE)
        pygame.mixer.music.play()
    except Exception as e:
        print(f"Error playing audio: {e}")

def ask_together_ai(prompt):
    try:
        if prompt.lower() == "i want to be fetty wap":
            print("\n🎵 Playing 'Yeah Baby!'...")
            play_yeah_baby()
            return "🎶 Yeah Baby! 🎶"

        response = openai.ChatCompletion.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}]
        )
        return response["choices"][0]["message"]["content"]
    
    except Exception as ex:
        return f"Unexpected Error: {ex}"

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    prompt = data.get('prompt', '')
    response = ask_together_ai(prompt)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
