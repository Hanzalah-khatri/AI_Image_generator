import os
import uuid
from pathlib import Path

from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from huggingface_hub import InferenceClient


# Load variables from .env
load_dotenv()


# Create Flask application
app = Flask(__name__)


# Folder where generated images will be saved
GENERATED_FOLDER = Path("static/generated")
GENERATED_FOLDER.mkdir(parents=True, exist_ok=True)


# Get Hugging Face token
HF_TOKEN = os.getenv("HF_TOKEN")


# Check whether token exists
if not HF_TOKEN:
    raise ValueError("HF_TOKEN is missing. Please add it to your .env file.")


# Connect to Hugging Face
client = InferenceClient(
    provider="auto",
    api_key=HF_TOKEN
)


# AI model
MODEL = "black-forest-labs/FLUX.1-schnell"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate_image():

    # Get data sent by JavaScript
    data = request.get_json()

    prompt = data.get("prompt", "").strip()

    style = data.get("style", "None").strip()

    style_prompts = {

        "None": "",

        "Photorealistic":
            "photorealistic, realistic lighting, highly detailed",

        "Anime":
            "anime art style, vibrant colors, clean line art",

        "Cinematic":
            "cinematic composition, dramatic lighting, movie still",

        "Digital Art":
            "high quality digital artwork, detailed illustration",

        "Watercolor":
            "beautiful watercolor painting, soft brush strokes",

        "3D Render":
            "high quality 3D render, realistic materials, studio lighting"

    }
    style_text = style_prompts.get(
        style,
        ""
    )

    final_prompt = f"{prompt}. {style_text}".strip()

    # Check prompt
    if not prompt:
        return jsonify({
            "success": False,
            "error": "Please enter a prompt."
        }), 400

    try:

        # Generate image using AI
        image = client.text_to_image(
            final_prompt,
            model=MODEL
        )

        # Create unique filename
        filename = f"{uuid.uuid4().hex}.png"

        # Create complete file path
        image_path = GENERATED_FOLDER / filename

        # Save generated image
        image.save(image_path)

        # Send image URL back to browser
        return jsonify({
            "success": True,
            "image_url": f"/static/generated/{filename}",

            "prompt": prompt,

            "style": style
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)