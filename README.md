# 🎨 PixelForge AI — AI Image Generator

An AI-powered image generation web application that converts text prompts into high-quality images using **Hugging Face's FLUX.1-schnell model**.

The application provides a clean and responsive interface where users can enter a prompt, select an artistic style, generate an image, download it, and maintain a local generation history.

## 🚀 Live Demo

🌐 **Live Website:**
https://ai-image-generator-hanzalah1.vercel.app/

## ✨ Features

* 🤖 **AI Image Generation**

  * Generate images from natural-language text prompts.
  * Powered by Hugging Face's FLUX.1-schnell model.

* 🎨 **Multiple Art Styles**

  * Photorealistic
  * Anime
  * Cinematic
  * Digital Art
  * Watercolor
  * 3D Render

* ⚡ **Fast Generation**

  * Uses the Hugging Face Inference API for AI image generation.

* 🖼️ **Image Preview**

  * Generated images are displayed directly in the application.

* 💾 **Download Images**

  * Download generated images as PNG files.

* 🕘 **Generation History**

  * Recently generated images are stored in browser local storage.
  * Users can view previous generations without a database.

* 🔍 **Image Modal**

  * Click on a generated image to view it in a larger format.

* 🗑️ **History Management**

  * Delete individual generated images.
  * Clear the complete generation history.

* 🌙 **Dark / Light Mode**

  * Switch between dark and light themes.

* ⌨️ **Keyboard Shortcut**

  * Press `Ctrl + Enter` to generate an image.

* 📱 **Responsive UI**

  * Designed to work across desktop and mobile screen sizes.

## 🛠️ Technologies Used

| Technology     | Purpose                       |
| -------------- | ----------------------------- |
| Python         | Backend programming           |
| Flask          | Web application framework     |
| Hugging Face   | AI inference                  |
| FLUX.1-schnell | Image generation model        |
| HTML5          | Frontend structure            |
| CSS3           | Styling and responsive design |
| JavaScript     | Frontend functionality        |
| LocalStorage   | Browser-based image history   |
| Vercel         | Deployment                    |

## 🏗️ Project Architecture

```text
User
 │
 │ Text Prompt + Style
 ▼
Frontend
HTML + CSS + JavaScript
 │
 │ POST /generate
 ▼
Flask Backend
 │
 │ Prompt + Style
 ▼
Hugging Face Inference API
 │
 │ FLUX.1-schnell
 ▼
Generated Image
 │
 │ Image converted to Base64
 ▼
Flask Response
 │
 ▼
Browser
 ├── Display Image
 ├── Download Image
 └── Save History to LocalStorage
```

## 📁 Project Structure

```text
AI_Image_Generator/
│
├── app.py
│
├── requirements.txt
│
├── vercel.json
│
├── .gitignore
│
├── templates/
│   └── index.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── script.js
│
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Move into the project directory:

```bash
cd AI_Image_Generator
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the virtual environment

#### Windows

```bash
venv\Scripts\activate
```

#### macOS / Linux

```bash
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

## 🔑 Environment Variables

The application requires a Hugging Face API token.

Create a `.env` file in the project root:

```env
HF_TOKEN=your_huggingface_token
```

### Important

Never commit your `.env` file to GitHub.

Make sure `.gitignore` contains:

```text
.env
venv/
__pycache__/
```

## ▶️ Running Locally

After activating your virtual environment and configuring your Hugging Face token:

```bash
python app.py
```

You should see Flask running locally.

Open:

```text
http://127.0.0.1:5000
```

in your browser.

## 🎯 How to Use

1. Open the application.
2. Enter a description of the image you want to generate.
3. Select an optional artistic style.
4. Click **Generate Image**.
5. Wait for the AI model to generate the image.
6. View the generated image.
7. Download the image if required.
8. Previously generated images can be viewed in the history section.

### Example Prompt

```text
A futuristic city at night with flying cars, neon lights, and skyscrapers
```

Select:

```text
Cinematic
```

The application combines the prompt with the selected style before sending it to the AI model.

## 🤖 AI Model

This project uses:

**FLUX.1-schnell**

Model:

```text
black-forest-labs/FLUX.1-schnell
```

The model is accessed through the Hugging Face Inference API.

## 🔄 Image Generation Process

When the user generates an image:

```text
1. User enters prompt
        ↓
2. JavaScript sends POST request
        ↓
3. Flask receives prompt and style
        ↓
4. Backend creates the final prompt
        ↓
5. Hugging Face generates the image
        ↓
6. Image is converted to PNG bytes
        ↓
7. Image is encoded as Base64
        ↓
8. Flask returns the image to the browser
        ↓
9. Browser displays the generated image
```

The application uses an in-memory approach instead of writing generated images to the Vercel filesystem. This is important because serverless deployment environments have restrictions on persistent filesystem writes.

## ☁️ Deployment

The project is deployed using **Vercel**.

Before deployment, configure the following environment variable in your Vercel project:

```text
HF_TOKEN
```

Then deploy the project through GitHub/Vercel integration.

Every new push to the configured GitHub branch can trigger a new Vercel deployment.

## 🔐 Security

The Hugging Face API token is stored as an environment variable.

The token should **never** be placed directly inside:

```python
app.py
```

or committed to GitHub.

Use:

```python
HF_TOKEN = os.getenv("HF_TOKEN")
```

instead.

## 📌 Current Limitations

* Generated images are returned as Base64 data URLs.
* Generation history is stored in browser `localStorage`.
* Clearing browser storage removes the local generation history.
* Images are not stored permanently on a cloud image-storage service.
* AI generation speed depends on Hugging Face API availability and model inference time.

## 🔮 Future Improvements

Possible improvements for future versions include:

* ☁️ Cloud image storage using Cloudinary, AWS S3, or Supabase Storage
* 👤 User accounts and authentication
* 🗄️ Database-backed image history
* ❤️ Favorite images
* 📤 Image sharing through public URLs
* 🖼️ Image-to-image generation
* ✏️ AI image editing
* 📐 Custom image resolutions
* 🎭 More artistic styles
* 🧠 Prompt enhancement
* 📊 Generation statistics
* 🚀 Improved production image caching

## 📚 What I Learned

This project helped me practice:

* Building a Flask web application
* Working with REST-style API endpoints
* Integrating an external AI inference API
* Using Hugging Face models
* Handling image data in Python
* Converting images to Base64
* Connecting JavaScript with a Flask backend
* Working with browser LocalStorage
* Environment variable management
* Git and GitHub
* Deploying a Python application with Vercel
* Debugging serverless deployment issues

## 👨‍💻 Author

**Hanzalah Khatri**

Software Engineering Student
FAST-NUCES Karachi

### Connect With Me

* LinkedIn: https://www.linkedin.com/in/hanzalah-khatri-79a9a335a/
* GitHub: https://github.com/hanzalah_khatri

## ⭐ Support

If you found this project interesting, consider giving the repository a ⭐ on GitHub!

---

**Built with ❤️ using Python, Flask, JavaScript, and Hugging Face FLUX.1-schnell.**
