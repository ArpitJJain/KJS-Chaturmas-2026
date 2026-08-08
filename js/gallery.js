document.addEventListener("DOMContentLoaded", async () => {

    console.log("================================");
    console.log("GALLERY V3 STARTED");
    console.log("================================");


    // ==========================================
    // ELEMENTS
    // ==========================================

    const grid =
        document.getElementById("gallery-grid");

    const loader =
        document.getElementById("gallery-loader");

    const endMessage =
        document.getElementById("gallery-end");

    const sentinel =
        document.getElementById("gallery-sentinel");


    // ==========================================
    // CONFIGURATION
    // ==========================================

    const DATA_URL =
        "./data/gallery.json";

    const IMAGE_PATH =
        "./images/gallery/";

    const BATCH_SIZE = 8;


    // ==========================================
    // STATE
    // ==========================================

    let galleryData = [];

    let currentIndex = 0;

    let loading = false;

    let finished = false;

    let observer = null;


    // ==========================================
    // VALIDATE HTML
    // ==========================================

    if (!grid) {

        console.error(
            "Gallery Error: #gallery-grid not found"
        );

        return;
    }


    // ==========================================
    // LOAD JSON
    // ==========================================

    try {

        console.log(
            "Loading:",
            DATA_URL
        );


        const response =
            await fetch(
                DATA_URL + "?v=" + Date.now()
            );


        if (!response.ok) {

            throw new Error(
                `Unable to load gallery.json. HTTP ${response.status}`
            );

        }


        galleryData =
            await response.json();


        // ======================================
        // VALIDATE JSON
        // ======================================

        if (!Array.isArray(galleryData)) {

            throw new Error(
                "gallery.json must contain an array"
            );

        }


        console.log(
            "Records before sorting:",
            galleryData.length
        );


        // ======================================
        // SORT BY DATE
        //
        // Newest → Oldest
        // ======================================

        galleryData.sort(
            (a, b) => {

                return new Date(b.date) -
                       new Date(a.date);

            }
        );


        console.log(
            "Gallery sorted newest → oldest"
        );


        console.table(
            galleryData
        );


    } catch (error) {

        console.error(
            "Gallery JSON error:",
            error
        );


        if (loader) {

            loader.innerHTML = `

                <div class="gallery-error">

                    <strong>
                        Gallery load नहीं हो पाई
                    </strong>

                    <br><br>

                    ${error.message}

                </div>

            `;

        }

        return;
    }


    // ==========================================
    // HIDE LOADER
    // ==========================================

    if (loader) {

        loader.style.display = "none";

    }


    // ==========================================
    // CREATE CARD
    // ==========================================

    function createGalleryCard(item) {

        const card =
            document.createElement("article");


        card.className =
            "gallery-tile";


        // --------------------------------------
        // IMAGE CONTAINER
        // --------------------------------------

        const imageWrapper =
            document.createElement("div");


        imageWrapper.className =
            "gallery-image-wrapper";


        // --------------------------------------
        // IMAGE
        // --------------------------------------

        const image =
            document.createElement("img");


        const imageUrl =
            IMAGE_PATH +
            item.fileName;


        image.className =
            "gallery-image";


        image.src =
            imageUrl;


        image.alt =
            item.title ||
            "Gallery image";


        image.loading =
            "lazy";


        image.decoding =
            "async";


        // --------------------------------------
        // IMAGE ERROR
        // --------------------------------------

        image.onerror = () => {

            console.error(
                "Image not found:",
                imageUrl
            );


            imageWrapper.innerHTML = `

                <div class="image-error">

                    🖼️

                    <br>

                    Image not found

                    <br>

                    <small>
                        ${item.fileName}
                    </small>

                </div>

            `;

        };


        imageWrapper.appendChild(
            image
        );


        // --------------------------------------
        // DETAILS
        // --------------------------------------

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


        // --------------------------------------
        // CARD
        // --------------------------------------

        card.appendChild(
            imageWrapper
        );

        card.appendChild(
            details
        );


        // --------------------------------------
        // OPEN FULL IMAGE
        // --------------------------------------

        card.addEventListener(
            "click",
            () => {

                window.open(
                    imageUrl,
                    "_blank"
                );

            }
        );


        return card;

    }


    // ==========================================
    // LOAD NEXT BATCH
    // ==========================================

    function loadNextBatch() {

        // --------------------------------------
        // HARD STOP
        // --------------------------------------

        if (finished) {

            console.log(
                "Gallery already finished."
            );

            return;

        }


        // --------------------------------------
        // PREVENT CONCURRENT LOADS
        // --------------------------------------

        if (loading) {

            return;

        }


        // --------------------------------------
        // NOTHING LEFT
        // --------------------------------------

        if (
            currentIndex >=
            galleryData.length
        ) {

            finishGallery();

            return;

        }


        loading = true;


        // --------------------------------------
        // DETERMINE BATCH
        // --------------------------------------

        const start =
            currentIndex;


        const end =
            Math.min(
                currentIndex +
                BATCH_SIZE,

                galleryData.length
            );


        console.log(
            `Rendering ${start + 1} → ${end}`
        );


        // --------------------------------------
        // ADVANCE INDEX FIRST
        // --------------------------------------

        currentIndex =
            end;


        // --------------------------------------
        // RENDER
        // --------------------------------------

        for (
            let i = start;
            i < end;
            i++
        ) {

            const item =
                galleryData[i];


            /*
             * Ignore malformed records
             */

            if (
                !item ||
                !item.fileName
            ) {

                console.warn(
                    "Invalid gallery record:",
                    item
                );

                continue;

            }


            const card =
                createGalleryCard(item);


            grid.appendChild(card);

        }


        loading = false;


        // --------------------------------------
        // CHECK END
        // --------------------------------------

        if (
            currentIndex >=
            galleryData.length
        ) {

            finishGallery();

        }

    }


    // ==========================================
    // FINISH GALLERY
    // ==========================================

    function finishGallery() {

        if (finished) {

            return;

        }


        finished = true;


        console.log(
            "================================"
        );

        console.log(
            "GALLERY COMPLETE"
        );

        console.log(
            "Displayed:",
            currentIndex
        );

        console.log(
            "Total:",
            galleryData.length
        );

        console.log(
            "================================"
        );


        // --------------------------------------
        // STOP OBSERVER
        // --------------------------------------

        if (observer) {

            observer.disconnect();

            observer = null;

        }


        // --------------------------------------
        // HIDE LOADER
        // --------------------------------------

        if (loader) {

            loader.style.display =
                "none";

        }


        // --------------------------------------
        // SHOW END MESSAGE
        // --------------------------------------

        if (endMessage) {

            endMessage.style.display =
                "block";

        }

    }


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    loadNextBatch();


    // ==========================================
    // INFINITE SCROLL
    // ==========================================

    /*
     * Only create the observer if
     * more records remain.
     */

    if (
        !finished &&
        currentIndex <
            galleryData.length &&
        sentinel
    ) {


        observer =
            new IntersectionObserver(

                entries => {

                    if (
                        entries[0]
                            .isIntersecting
                    ) {

                        loadNextBatch();

                    }

                },

                {

                    root: null,

                    /*
                     * Start loading before
                     * the user reaches bottom.
                     */

                    rootMargin:
                        "500px 0px",

                    threshold: 0

                }

            );


        observer.observe(
            sentinel
        );

    }

});
