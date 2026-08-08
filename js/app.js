const siteContent = {
  announce: 'announce-text',
  date: 'todays-date',
  shrav: 'todays-shrav',
  kalash: 'todays-kalash',
  announcement: 'todays-announcement',
  location: 'footer-location'
};

async function loadHomeData() {
  try {
    const response = await fetch('data/home.json');
    if (!response.ok) {
      throw new Error('Unable to load home data');
    }

    const data = await response.json();

    const announceText = document.getElementById(siteContent.announce);
    const todayDate = document.getElementById(siteContent.date);
    const shravShresthi = document.getElementById(siteContent.shrav);
    const kalash = document.getElementById(siteContent.kalash);
    const announcement = document.getElementById(siteContent.announcement);
    const footerLocation = document.getElementById(siteContent.location);

    if (announceText) announceText.textContent = data.announcement || 'जिनधर्म आराधना चातुर्मास में आपका स्वागत है';
    if (todayDate) todayDate.textContent = data.todayDate || data.date || 'आज का दिन';
    if (shravShresthi) shravShresthi.textContent = data.shravShresthi || 'श्राव श्रेष्ठी';
    if (kalash) kalash.textContent = data.kalash || 'कलश स्थापना';
    if (announcement) announcement.textContent = data.announcement || 'जिनधर्म आराधना चातुर्मास में आपका स्वागत है';
    if (footerLocation) footerLocation.textContent = data.location || 'आदिनाथ जिनालय, खराड़ी, पुणे';
  } catch (error) {
    console.warn('Home data could not be loaded:', error);
  }
}
async function loadTodayShravak() {

    const element =
        document.getElementById("todays-shrav");

    if (!element) {
        return;
    }

    try {

        const response =
            await fetch("./data/shravak-shresthi.json");

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data =
            await response.json();


        // -----------------------------
        // LOCAL SYSTEM DATE
        // -----------------------------

        const now = new Date();

        const year =
            now.getFullYear();

        const month =
            String(now.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(now.getDate())
                .padStart(2, "0");

        const today =
            `${year}-${month}-${day}`;


        // -----------------------------
        // FIND TODAY
        // -----------------------------

        const entry =
            data.find(
                item => item.date === today
            );


        if (!entry) {

            element.textContent =
                "नाम उपलब्ध नहीं है";

            return;
        }


        if (entry.name === "❌") {

            element.textContent =
                "आज श्रावक श्रेष्ठी नहीं है";

        } else if (!entry.name) {

            element.textContent =
                "नाम उपलब्ध नहीं है";

        } else {

            element.textContent =
                entry.name;

        }

    } catch (error) {

        console.error(
            "Shravak Shresthi error:",
            error
        );

        element.textContent =
            "जानकारी उपलब्ध नहीं है";

    }
}


// Dynamic content is now refreshed after footer markup is inserted by the component loader.
// The page fragments are injected during DOMContentLoaded, so the JSON bindings run there.