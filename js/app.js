const siteContent = {
  announce: 'announce-text',
  date: 'todays-date',
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
    const kalash = document.getElementById(siteContent.kalash);
    const announcement = document.getElementById(siteContent.announcement);
    const footerLocation = document.getElementById(siteContent.location);

    if (announceText) announceText.textContent = data.announcement || 'जिनधर्म आराधना चातुर्मास में आपका स्वागत है';
    if (todayDate) todayDate.textContent = data.todayDate || data.date || 'आज का दिन';
    if (kalash) kalash.textContent = data.kalash || 'कलश स्थापना';
    if (announcement) {
      if (typeof getAnnouncementByDate === 'function') {
        const announcementText = await getAnnouncementByDate(getTodayDate());
        announcement.textContent = announcementText?.text || data.announcement || 'जिनधर्म आराधना चातुर्मास में आपका स्वागत है';
      } else {
        announcement.textContent = data.announcement || 'जिनधर्म आराधना चातुर्मास में आपका स्वागत है';
      }
    }

    if (footerLocation) footerLocation.textContent = data.location || 'आदिनाथ जिनालय, खराड़ी, pune';
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

        if (typeof loadShravakData === "function") {
            await loadShravakData();
        } else {
            const response = await fetch('./data/shravak-shresthi.json?v=' + Date.now());

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            shravakDataCache = data.map(item => ({
                ...item,
                normalizedDate: normalizeDate(item.date)
            }));
        }

        const today = getTodayDate();
        const entry = getShravakNameByDateSync(today);
        const displayName = getShravakDisplayName(entry);

        element.textContent = displayName;

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