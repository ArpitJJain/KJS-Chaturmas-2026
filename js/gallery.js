document.addEventListener("DOMContentLoaded", function () {

    const galleryGrid =
        document.getElementById("gallery-grid");

    const loader =
        document.getElementById("gallery-loader");

    const galleryEnd =
        document.getElementById("gallery-end");

    const sentinel =
        document.getElementById("gallery-sentinel");


    const DATA_URL = "./data/gallery.json";
    const IMAGE_PATH = "./images/gallery/";

    // Number of cards added at a time
    const BATCH_SIZE = 8;


    let galleryData = [];
    let currentIndex = 0;

    // Keeps track of images already displayed
    const displayedImages = new Set();

    let observer = null;
    let loading = false;


    // ------------------------------------------
    // LOAD JSON
    // ------------------------------------------

    async function loadGallery() {

        try {

            console.log("Loading gallery JSON...");

            const response =
                await fetch(DATA_URL);

            if (!response.ok) {

                throw new Error(
                    `Gallery JSON HTTP error: ${response.status}`
                );

            }


            const data =
                await response.json();


            if (!Array.isArray(data)) {

                throw new Error(
                    "gallery.json must contain an array"
                );

            }


            galleryData = data;

            console.log(
                `Gallery contains ${galleryData.length} items`
            );


            // Remove loader
            loader.style.display = "none";


            // Load first batch
            loadNextBatch();


            // Setup infinite scrolling
            setupObserver();


        } catch (error) {

            console.error(
                "Gallery error:",
                error
            );


            loader.innerHTML = `
                <div class="gallery-error">
                    Gallery load नहीं हो पाई
                    <br><br>
                    ${error.message}
                </div>
            `;

        }

    }


    // ------------------------------------------
    // LOAD NEXT BATCH
    // ------------------------------------------

    function loadNextBatch() {

        // Already loading
        if (loading) {
            return;
        }


        // NOTHING LEFT
        if (
            currentIndex >= galleryData.length
        ) {

            finishGallery();

            return;
        }


        loading = true;


        const startIndex =
            currentIndex;


        const endIndex =
            Math.min(
                currentIndex + BATCH_SIZE,
                galleryData.length
            );


        console.log(
            `Loading ${startIndex} to ${endIndex - 1}`
        );


        for (
            let i = startIndex;
            i < endIndex;
            i++
        ) {

            const item =
                galleryData[i];


            // ----------------------------------
            // DUPLICATE PROTECTION
            // ----------------------------------

            if (
                !item.fileName ||
                displayedImages.has(item.fileName)
            ) {

                continue;

            }


            displayedImages.add(
                item.fileName
            );


            createGalleryTile(item);

        }


        // IMPORTANT:
        // Always move forward.
        currentIndex = endIndex;


        loading = false;


        // ----------------------------------
        // CHECK IF WE ARE DONE
        // ----------------------------------

        if (
            currentIndex >= galleryData.length
        ) {

            finishGallery();

        }

    }


    // ------------------------------------------
    // CREATE CARD
    // ------------------------------------------

    function createGalleryTile(item) {

        const card =
            document.createElement("article");

        card.className =
            "gallery-tile";


        const imageWrapper =
            document.createElement("div");

        imageWrapper.className =
            "gallery-image-wrapper";


        const image =
            document.createElement("img");


        const imageUrl =
            IMAGE_PATH + item.fileName;


        image.className =
            "gallery-image";


        image.src =
            imageUrl;


        image.alt =
            item.title || "Gallery image";


        image.loading =
            "lazy";


        image.decoding =
            "async";


        image.onerror = function () {

            console.error(
                "Image not found:",
                imageUrl
            );

        };


        imageWrapper.appendChild(image);


        // ----------------------------------
        // DETAILS
        // ----------------------------------

        const details =
            document.createElement("div");

        details.className =
            "gallery-details";


        const title =
            document.createElement("span");

        title.className =
            "gallery-title";

        title.textContent =
            item.title || "";


        const subtitle =
            document.createElement("span");

        subtitle.className =
            "gallery-subtitle";

        subtitle.textContent =
            item.subtitle || "";


        details.appendChild(title);
        details.appendChild(subtitle);


        card.appendChild(imageWrapper);
        card.appendChild(details);


        // ----------------------------------
        // OPEN FULL IMAGE
        // ----------------------------------

        card.addEventListener(
            "click",
            function () {

                window.open(
                    imageUrl,
                    "_blank"
                );

            }
        );


        galleryGrid.appendChild(card);

    }


    // ------------------------------------------
    // INFINITE SCROLL
    // ------------------------------------------

    function setupObserver() {

        // If there is no sentinel,
        // don't enable infinite scroll.

        if (!sentinel) {

            console.warn(
                "gallery-sentinel not found"
            );

            return;

        }


        observer =
            new IntersectionObserver(

                function (entries) {

                    if (
                        entries[0].isIntersecting
                    ) {

                        loadNextBatch();

                    }

                },

                {
                    root: null,

                    // Start loading before bottom
                    rootMargin: "500px 0px",

                    threshold: 0
                }

            );


        observer.observe(
            sentinel
        );

    }


    // ------------------------------------------
    // FINISH
    // ------------------------------------------

    function finishGallery() {

        console.log(
            "Gallery complete. No more images."
        );


        if (observer) {

            observer.disconnect();

            observer = null;

        }


        if (loader) {

            loader.style.display =
                "none";

        }


        if (galleryEnd) {

            galleryEnd.style.display =
                "block";

        }

    }


    // ------------------------------------------
    // START
    // ------------------------------------------

    loadGallery();

});