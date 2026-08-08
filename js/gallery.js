document.addEventListener("DOMContentLoaded", async function () {

    const galleryGrid = document.getElementById("gallery-grid");
    const loader = document.getElementById("gallery-loader");
    const galleryEnd = document.getElementById("gallery-end");

    const DATA_URL = "./data/gallery.json";
    const IMAGE_PATH = "./images/gallery/";

    console.log("Gallery JS started");

    if (!galleryGrid) {
        console.error("ERROR: gallery-grid not found");
        return;
    }

    try {

        console.log("Loading:", DATA_URL);

        const response = await fetch(DATA_URL);

        console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error(
                "Could not load gallery.json. HTTP " + response.status
            );
        }

        const gallery = await response.json();

        console.log("Gallery data:", gallery);

        if (!Array.isArray(gallery)) {
            throw new Error(
                "gallery.json must contain an array"
            );
        }

        loader.style.display = "none";

        gallery.forEach(function (item) {

            const card = document.createElement("article");

            card.className = "gallery-tile";


            const imageWrapper =
                document.createElement("div");

            imageWrapper.className =
                "gallery-image-wrapper";


            const image =
                document.createElement("img");

            const imageUrl =
                IMAGE_PATH + item.fileName;

            image.src = imageUrl;

            image.alt =
                item.title || "Gallery image";

            image.loading = "lazy";

            image.decoding = "async";


            image.onerror = function () {

                console.error(
                    "IMAGE NOT FOUND:",
                    imageUrl
                );

                imageWrapper.innerHTML = `
                    <div class="image-error">
                        🖼️<br>
                        Image not found
                        <small>${item.fileName}</small>
                    </div>
                `;
            };


            image.onload = function () {

                console.log(
                    "IMAGE LOADED:",
                    imageUrl
                );

            };


            imageWrapper.appendChild(image);


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


            /*
             * Open original full-size image
             */
            card.addEventListener("click", function () {

                window.open(
                    imageUrl,
                    "_blank"
                );

            });


            galleryGrid.appendChild(card);

        });


        galleryEnd.style.display = "block";

        console.log(
            "Gallery successfully rendered:",
            gallery.length
        );


    } catch (error) {

        console.error(
            "GALLERY ERROR:",
            error
        );


        loader.innerHTML = `
            <div class="gallery-error">
                <strong>Gallery load नहीं हो पाई</strong>
                <br><br>
                ${error.message}
            </div>
        `;

    }

});