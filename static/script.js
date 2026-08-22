const promptInput = document.getElementById("prompt");
const styleInput = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");
const buttonText = document.getElementById("buttonText");
const loader = document.getElementById("loader");
const message = document.getElementById("message");
const status = document.getElementById("status");

const emptyState = document.getElementById("emptyState");
const imageState = document.getElementById("imageState");
const generatedImage = document.getElementById("generatedImage");
const downloadBtn = document.getElementById("downloadBtn");

const historyGrid = document.getElementById("historyGrid");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("PixelForge AI loaded");

    displayHistory();

});


/* =========================================
   GENERATE BUTTON
========================================= */

generateBtn.addEventListener("click", generateImage);


/* =========================================
   CTRL + ENTER
========================================= */

promptInput.addEventListener("keydown", function (event) {

    if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "Enter"
    ) {

        generateImage();

    }

});


/* =========================================
   GENERATE IMAGE
========================================= */

async function generateImage() {

    const prompt = promptInput.value.trim();
    const style = styleInput.value;


    message.textContent = "";


    if (!prompt) {

        message.textContent =
            "Please enter a prompt first.";

        promptInput.focus();

        return;
    }


    setLoading(true);

    status.textContent = "Generating...";


    try {

        console.log("Sending prompt:", prompt);
        console.log("Selected style:", style);


        const response = await fetch(
            "/generate",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    prompt: prompt,
                    style: style

                })

            }
        );


        const data = await response.json();


        console.log("Server response:", data);


        if (!response.ok || !data.success) {

            throw new Error(
                data.error ||
                "Image generation failed."
            );

        }


        /* =================================
           DISPLAY GENERATED IMAGE
        ================================= */

        generatedImage.src =
            data.image_url;

        generatedImage.alt =
            prompt;


        emptyState.classList.add(
            "hidden"
        );

        imageState.classList.remove(
            "hidden"
        );


        /* =================================
           DOWNLOAD BUTTON
        ================================= */

        downloadBtn.href =
            data.image_url;

        downloadBtn.download =
            "ai_generated_image.png";

        downloadBtn.classList.remove(
            "hidden"
        );


        status.textContent =
            "Image ready";


        /* =================================
           SAVE TO HISTORY
        ================================= */

        saveToHistory(
            data.image_url,
            prompt,
            style
        );


        console.log(
            "Image saved to history."
        );


    }

    catch (error) {

        console.error(
            "Generation error:",
            error
        );

        status.textContent =
            "Generation failed";

        message.textContent =
            error.message;

    }

    finally {

        setLoading(false);

    }

}


/* =========================================
   LOADING
========================================= */

function setLoading(isLoading) {

    generateBtn.disabled =
        isLoading;


    if (isLoading) {

        buttonText.textContent =
            "Generating...";

        loader.classList.remove(
            "hidden"
        );

    }

    else {

        buttonText.textContent =
            "✨ Generate Image";

        loader.classList.add(
            "hidden"
        );

    }

}


/* =========================================
   SAVE HISTORY
========================================= */

function saveToHistory(
    imageUrl,
    prompt,
    style
) {

    let history = [];


    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    "imageHistory"
                )
            ) || [];

    }

    catch (error) {

        console.error(
            "Could not read history:",
            error
        );

        history = [];

    }


    const imageData = {

        imageUrl: imageUrl,

        prompt: prompt,

        style: style,

        date:
            new Date().toLocaleString()

    };


    history.unshift(imageData);


    /* Keep latest 5 */

    history =
        history.slice(0, 5);

    localStorage.setItem(
        "imageHistory",
        JSON.stringify(history)
    );


    displayHistory();

}


/* =========================================
   DISPLAY HISTORY
========================================= */

function displayHistory() {

    let history = [];

    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    "imageHistory"
                )
            ) || [];

    }

    catch (error) {

        console.error(
            "Could not load history:",
            error
        );

        history = [];

    }


    historyGrid.innerHTML = "";


    /* ==============================
       EMPTY GALLERY
    ============================== */

    if (history.length === 0) {

        historyGrid.innerHTML = `

            <div class="no-history">

                <div class="empty-icon">
                    ◈
                </div>

                <h3>
                    No images yet
                </h3>

                <p>
                    Generate your first image
                    to see it here.
                </p>

            </div>

        `;

        return;
    }


    /* ==============================
       CREATE GALLERY CARDS
    ============================== */

    history.forEach(function (item, index) {

        const card =
            document.createElement("div");

        card.className =
            "history-item";


        card.innerHTML = `

            <img
                src="${item.imageUrl}"
                alt="AI generated image"
                class="gallery-image"
                data-index="${index}"
            >


            <div class="history-info">

                <p class="history-prompt">
                    ${escapeHTML(item.prompt)}
                </p>


                <p class="history-style">
                    🎨 ${escapeHTML(item.style || "None")}
                </p>


                <p class="history-date">
                    🕒 ${escapeHTML(item.date || "")}
                </p>


                <div class="history-actions">

                    <a
                        href="${item.imageUrl}"
                        download="ai_generated_image.png"
                        class="history-download"
                    >
                        ↓ Download
                    </a>


                    <button
                        class="history-delete"
                        data-index="${index}"
                    >
                        🗑 Delete
                    </button>

                </div>

            </div>

        `;


        historyGrid.appendChild(card);

    });


    /* ==============================
       IMAGE CLICK
    ============================== */

    document
        .querySelectorAll(".gallery-image")
        .forEach(function (image) {

            image.addEventListener(
                "click",
                function () {

                    const index =
                        parseInt(
                            this.dataset.index
                        );

                    openImageModal(
                        history[index]
                    );

                }
            );

        });


    /* ==============================
       DELETE BUTTONS
    ============================== */

    document
        .querySelectorAll(".history-delete")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        parseInt(
                            this.dataset.index
                        );

                    deleteHistoryItem(index);

                }
            );

        });

}

function deleteHistoryItem(index) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "imageHistory"
            )
        ) || [];


    history.splice(index, 1);


    localStorage.setItem(
        "imageHistory",
        JSON.stringify(history)
    );


    displayHistory();

}
function openImageModal(item) {

    const modal =
        document.getElementById(
            "imageModal"
        );

    const modalImage =
        document.getElementById(
            "modalImage"
        );

    const modalPrompt =
        document.getElementById(
            "modalPrompt"
        );

    const modalStyle =
        document.getElementById(
            "modalStyle"
        );

    const modalDate =
        document.getElementById(
            "modalDate"
        );


    modalImage.src =
        item.imageUrl;


    modalPrompt.textContent =
        item.prompt;


    modalStyle.textContent =
        "Style: " +
        (item.style || "None");


    modalDate.textContent =
        "Generated: " +
        (item.date || "");


    modal.classList.remove(
        "hidden"
    );

}
const imageModal =
    document.getElementById(
        "imageModal"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );


closeModal.addEventListener(
    "click",
    function () {

        imageModal.classList.add(
            "hidden"
        );

    }
);


imageModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === imageModal
        ) {

            imageModal.classList.add(
                "hidden"
            );

        }

    }
);


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            imageModal.classList.add(
                "hidden"
            );

        }

    }
);

/* =========================================
   CLEAR HISTORY
========================================= */

clearHistoryBtn.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "imageHistory"
        );

        displayHistory();

    }
);


/* =========================================
   SECURITY
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}

/* ================================= */
/* DARK / LIGHT MODE */
/* ================================= */

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


/*
    Load saved theme
*/

const savedTheme =
    localStorage.getItem(
        "theme"
    );


if (savedTheme === "light") {

    document.body.classList.add(
        "light-theme"
    );

    themeToggle.textContent = "🌙";

}


/*
    Toggle theme
*/

themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "light-theme"
        );


        const isLight =
            document.body.classList.contains(
                "light-theme"
            );


        if (isLight) {

            themeToggle.textContent =
                "🌙";

            localStorage.setItem(
                "theme",
                "light"
            );

        }

        else {

            themeToggle.textContent =
                "☀️";

            localStorage.setItem(
                "theme",
                "dark"
            );

        }

    }
);
/* ================================= */
/* PROMPT CHARACTER COUNTER */
/* ================================= */

const charCount =
    document.getElementById(
        "charCount"
    );


promptInput.addEventListener(
    "input",
    function () {

        charCount.textContent =
            `${promptInput.value.length} / 1000`;

    }
);