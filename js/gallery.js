const GALLERY_DATA_URL = "data/gallery.json";
const IMAGE_PATH = "images/gallery/";

const BATCH_SIZE = 8;

let galleryData = [];
let currentIndex = 0;
let isLoading = false;

const galleryGrid = document.getElementById("gallery-grid");
const loader = document.getElementById("gallery-loader");
const galleryEnd = document.getElementById("gallery-end");
const sentinel = document.getElementById("gallery-sentinel");


/*
 * Load gallery data
 */
async function loadGalleryData() {

    try {

        const response = await fetch(GALLERY_DATA_URL);

        if (!response.ok) {
            throw new Error("Unable to load gallery.json");
        }

        galleryData = await response.json();

        // Hide end message initially
        galleryEnd.style.display = "none";

        // Load first batch
        loadNextBatch();

    } catch (error) {

        console.error("Gallery loading error:", error);

        galleryGrid.innerHTML = `
            <div class="gallery-error">
                <p>Gallery load नहीं हो पाई।</p>
                <small>Please try again later.</small>
            </div>
        `;

        loader.style.display = "none";
    }
}


/*
 * Load next batch of images
 */
function loadNextBatch() {

    if (isLoading) {
        return;
    }

    if (currentIndex >= galleryData.length) {

        loader.style.display = "none";
        galleryEnd.style.display = "block";

        return;
    }

    isLoading = true;

    loader.style.display = "flex";


    const nextItems = galleryData.slice(
        currentIndex,
        currentIndex + BATCH_SIZE
    );


    nextItems.forEach(item => {

        const tile = createGalleryTile(item);

        galleryGrid.appendChild(tile);

    });


    currentIndex += nextItems.length;

    isLoading = false;


    // If everything has been loaded
    if (currentIndex >= galleryData.length) {

        loader.style.display = "none";
        galleryEnd.style.display = "block";
    }
}


/*
 * Create one gallery tile
 */
function createGalleryTile(item) {

    const article = document.createElement("article");

    article.className = "gallery-tile";


    /*
     * Clicking the thumbnail opens
     * the original image in a new browser tab.
     */
    article.addEventListener("click", () => {

        const fullImageUrl = IMAGE_PATH + item.fileName;

        window.open(fullImageUrl, "_blank");

    });


    const imageWrapper = document.createElement("div");

    imageWrapper.className = "gallery-image-wrapper";


    const image = document.createElement("img");

    image.className = "gallery-image";

    image.src = IMAGE_PATH + item.fileName;

    image.alt = item.title || "Gallery Image";

    /*
     * Browser native lazy loading
     */
    image.loading = "lazy";

    image.decoding = "async";


    /*
     * If an image is missing
     */
    image.onerror = () => {

        imageWrapper.classList.add("image-error");

        imageWrapper.innerHTML = `
            <span>Image unavailable</span>
        `;
    };


    imageWrapper.appendChild(image);


    const details = document.createElement("div");

    details.className = "gallery-details";


    const title = document.createElement("span");

    title.className = "gallery-title";

    title.textContent = item.title || "";


    const subtitle = document.createElement("span");

    subtitle.className = "gallery-subtitle";

    subtitle.textContent = item.subtitle || "";


    details.appendChild(title);
    details.appendChild(subtitle);


    article.appendChild(imageWrapper);
    article.appendChild(details);


    return article;
}


/*
 * Infinite scrolling
 *
 * When the user gets close to the bottom,
 * load another batch.
 */
const observer = new IntersectionObserver(

    entries => {

        if (entries[0].isIntersecting) {

            loadNextBatch();

        }

    },

    {
        root: null,

        /*
         * Start loading before the user
         * actually reaches the bottom.
         */
        rootMargin: "500px 0px",

        threshold: 0
    }

);


observer.observe(sentinel);


/*
 * Start gallery
 */
loadGalleryData();