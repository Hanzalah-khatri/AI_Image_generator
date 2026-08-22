import os
import uuid
import base64
from io import BytesIO

from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from huggingface_hub import InferenceClient


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

app = Flask(__name__)


# ============================================================
# HUGGING FACE TOKEN
# ============================================================

HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    raise ValueError("HF_TOKEN is missing. Please add it to your environment variables.")


# ============================================================
# HUGGING FACE CLIENT
# ============================================================

client = InferenceClient(
    provider="auto",
    api_key=HF_TOKEN
)


# ============================================================
# AI MODEL
# ============================================================

MODEL = "black-forest-labs/FLUX.1-schnell"


# ============================================================
# HOME PAGE
# ============================================================

@app.route("/")
def home():
    return render_template("index.html")


# ============================================================
# IMAGE GENERATION
# ============================================================

@app.route("/generate", methods=["POST"])
def generate_image():

    try:

        # ----------------------------------------------------
        # Get JSON data from frontend
        # ----------------------------------------------------

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "error": "No data received."
            }), 400

        prompt = data.get("prompt", "").strip()

        style = data.get("style", "None").strip()


        # ----------------------------------------------------
        # Validate prompt
        # ----------------------------------------------------

        if not prompt:
            return jsonify({
                "success": False,
                "error": "Please enter a prompt."
            }), 400


        # ----------------------------------------------------
        # Available styles
        # ----------------------------------------------------

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


        # ----------------------------------------------------
        # Get selected style
        # ----------------------------------------------------

        style_text = style_prompts.get(style, "")


        # ----------------------------------------------------
        # Create final prompt
        # ----------------------------------------------------

        if style_text:

            final_prompt = f"{prompt}, {style_text}"

        else:

            final_prompt = prompt


        # ----------------------------------------------------
        # Generate image
        # ----------------------------------------------------

        image = client.text_to_image(
            final_prompt,
            model=MODEL
        )


        # ----------------------------------------------------
        # Convert image to PNG bytes
        #
        # IMPORTANT:
        # We DO NOT save the image to the Vercel filesystem.
        # ----------------------------------------------------

        image_buffer = BytesIO()

        image.save(
            image_buffer,
            format="PNG"
        )

        image_buffer.seek(0)


        # ----------------------------------------------------
        # Convert PNG to Base64
        # ----------------------------------------------------

        image_base64 = base64.b64encode(
            image_buffer.getvalue()
        ).decode("utf-8")


        # ----------------------------------------------------
        # Create a data URL
        # ----------------------------------------------------

        image_url = f"data:image/png;base64,{image_base64}"


        # ----------------------------------------------------
        # Unique ID
        #
        # This is only an ID for the frontend.
        # It is NOT used as a filename.
        # ----------------------------------------------------

        image_id = uuid.uuid4().hex


        # ----------------------------------------------------
        # Send image back to frontend
        # ----------------------------------------------------

        return jsonify({

            "success": True,

            "image_url": image_url,

            "image_id": image_id,

            "prompt": prompt,

            "style": style

        })


    # ========================================================
    # ERROR HANDLING
    # ========================================================

    except Exception as e:

        print("IMAGE GENERATION ERROR:", str(e))

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ============================================================
# RUN LOCALLY
# ============================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )