// ==========================================
// DAILY DATA HELPERS
// ==========================================

const SHARAVAK_DATA_URL =
    "./data/shravak-shresthi.json";

const ANNOUNCEMENT_DATA_URL =
    "./data/announcements.json";

const HINDU_CALENDAR_DATA_URL =
    "./data/hindu-calendar.json";


let shravakDataCache = null;
let announcementDataCache = null;
let hinduCalendarDataCache = null;


// ==========================================
// NORMALIZE DATE
// ==========================================

function normalizeDate(value) {

    if (!value) {
        return null;
    }


    const text =
        String(value).trim();


    /*
     * Already YYYY-MM-DD
     */

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(text)
    ) {

        return text;

    }


    /*
     * ISO date/time
     *
     * Example:
     * 2026-08-08T00:00:00
     */

    if (
        /^\d{4}-\d{2}-\d{2}T/.test(text)
    ) {

        return text.substring(0, 10);

    }


    /*
     * Try JavaScript Date
     */

    const date =
        new Date(text);


    if (
        Number.isNaN(date.getTime())
    ) {

        return null;

    }


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


// ==========================================
// LOAD SHARAVAK DATA
// ==========================================

async function loadShravakData() {

    if (shravakDataCache) {

        return shravakDataCache;

    }


    const response =
        await fetch(
            SHARAVAK_DATA_URL +
            "?v=" +
            Date.now()
        );


    if (!response.ok) {

        throw new Error(
            `Unable to load Shravak data (${response.status})`
        );

    }


    const data =
        await response.json();


    if (!Array.isArray(data)) {

        throw new Error(
            "shravak-shresthi.json must contain an array"
        );

    }


    /*
     * Normalize every date once
     */

    shravakDataCache =
        data.map(item => ({

            ...item,

            normalizedDate:
                normalizeDate(item.date)

        }));


    console.log(
        "Shravak data loaded:",
        shravakDataCache.length
    );


    return shravakDataCache;

}


// ==========================================
// FIND SHARAVAK BY DATE
// ==========================================

async function getShravakByDate(date) {

    const data =
        await loadShravakData();


    const normalizedDate =
        normalizeDate(date);


    if (!normalizedDate) {

        return null;

    }


    const entry =
        data.find(
            item =>
                item.normalizedDate ===
                normalizedDate
        );


    return entry || null;

}


// ==========================================
// GET TODAY
// ==========================================

function getTodayDate() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


// ==========================================
// DISPLAY NAME
// ==========================================

function getShravakDisplayName(entry) {

    if (!entry) {

        return "नाम उपलब्ध नहीं है";

    }


    if (entry.name === "❌") {

        return "आज श्रावक श्रेष्ठी नहीं है";

    }


    if (
        !entry.name ||
        !String(entry.name).trim()
    ) {

        return "नाम उपलब्ध नहीं है";

    }


    return entry.name;

}

function getShravakNameByDateSync(date) {

    if (!shravakDataCache) {
        return null;
    }

    const normalizedDate =
        normalizeDate(date);

    const entry =
        shravakDataCache.find(
            item =>
                item.normalizedDate === normalizedDate
        );

    return entry || null;
}

// ==========================================
// LOAD ANNOUNCEMENT DATA
// ==========================================

async function loadAnnouncementData() {

    if (announcementDataCache) {
        return announcementDataCache;
    }

    const response =
        await fetch(
            ANNOUNCEMENT_DATA_URL +
            "?v=" +
            Date.now()
        );

    if (!response.ok) {
        throw new Error(
            `Unable to load announcements data (${response.status})`
        );
    }

    const data =
        await response.json();

    if (!Array.isArray(data)) {
        throw new Error(
            "announcements.json must contain an array"
        );
    }

    announcementDataCache =
        data.map(item => ({
            ...item,
            normalizedDate:
                normalizeDate(item.date)
        }));

    console.log(
        "Announcement data loaded:",
        announcementDataCache.length
    );

    return announcementDataCache;
}

async function getAnnouncementByDate(date) {

    const data =
        await loadAnnouncementData();

    const normalizedDate =
        normalizeDate(date);

    if (!normalizedDate) {
        return null;
    }

    const entry =
        data.find(
            item =>
                item.normalizedDate ===
                normalizedDate
        );

    return entry || null;
}

function getAnnouncementText(entry) {

    if (!entry) {
        return "";
    }

    const text =
        entry.text ||
        entry.announcement ||
        entry.message ||
        entry.title ||
        "";

    return String(text).trim();
}

function getAnnouncementTextByDateSync(date) {

    if (!announcementDataCache) {
        return null;
    }

    const normalizedDate =
        normalizeDate(date);

    const entry =
        announcementDataCache.find(
            item =>
                item.normalizedDate === normalizedDate
        );

    return entry || null;
}

async function loadHinduCalendarData() {

    if (hinduCalendarDataCache) {
        return hinduCalendarDataCache;
    }

    const response =
        await fetch(
            HINDU_CALENDAR_DATA_URL +
            "?v=" +
            Date.now()
        );

    if (!response.ok) {
        throw new Error(
            `Unable to load Hindu calendar data (${response.status})`
        );
    }

    const data =
        await response.json();

    if (!Array.isArray(data)) {
        throw new Error(
            "hindu-calendar.json must contain an array"
        );
    }

    hinduCalendarDataCache =
        data.map(item => ({
            ...item,
            normalizedDate:
                normalizeDate(item.date)
        }));

    return hinduCalendarDataCache;
}

async function getHinduCalendarByDate(date) {

    const data =
        await loadHinduCalendarData();

    const normalizedDate =
        normalizeDate(date);

    if (!normalizedDate) {
        return null;
    }

    const entry =
        data.find(
            item =>
                item.normalizedDate === normalizedDate
        );

    return entry || null;
}