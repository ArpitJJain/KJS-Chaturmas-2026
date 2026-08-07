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

loadHomeData();