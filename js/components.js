document.addEventListener("DOMContentLoaded", async function () {

    console.log("Loading common components");

    async function loadComponent(
        elementId,
        file
    ) {

        const element =
            document.getElementById(elementId);


        if (!element) {

            console.warn(
                `Component container #${elementId} not found`
            );

            return;

        }


        try {

            const response =
                await fetch(file);


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const html =
                await response.text();


            element.innerHTML =
                html;


        } catch (error) {

            console.error(
                `Unable to load ${file}`,
                error
            );

        }

    }

    function highlightCurrentPage() {

        const currentPage =
            window.location.pathname
                .split("/")
                .pop() || "index.html";

        const allPageLinks = [
            ...document.querySelectorAll(".main-nav .nav-link"),
            ...document.querySelectorAll(".mobile-bottom-nav .bottom-nav-link")
        ];

        allPageLinks.forEach(link => {
            const href = link.getAttribute("href");
            const isActive = href === currentPage;
            link.classList.toggle("active", isActive);
        });

    }

    // ----------------------------------------
    // Load navbar
    // ----------------------------------------

    await loadComponent(
        "navbar",
        "./components/navbar.html"
    );


    // ----------------------------------------
    // Load footer
    // ----------------------------------------

    await loadComponent(
        "footer",
        "./components/footer.html"
    );

    highlightCurrentPage();

    // ----------------------------------------
    // Mobile navigation
    // ----------------------------------------

    const navToggle =
        document.getElementById("nav-toggle");


    const navLinks =
        document.getElementById("nav-links");


    if (
        navToggle &&
        navLinks
    ) {

        navToggle.addEventListener(
            "click",
            function () {

                navLinks.classList.toggle(
                    "open"
                );

            }
        );

    }

    if (typeof loadHomeData === "function") {
        await loadHomeData();
    }

    if (typeof loadTodayShravak === "function") {
        await loadTodayShravak();
    }

});