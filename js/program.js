// =========================================================
// DAINIK KARYAKRAM - VERSION 2
// Date picker + special-date fallback to daily program
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  const DATA_URL = "./data/program.json";

  const picker = document.getElementById("program-date-picker");
  const selectedDateLabel = document.getElementById("selected-date-label");
  const programList = document.getElementById("program-list");
  const programEmpty = document.getElementById("program-empty");
  const programDate = document.getElementById("program-date");
  const programType = document.getElementById("program-type");
  const programTitle = document.getElementById("program-title");
  const modeIcon = document.getElementById("program-mode-icon");
  const modeText = document.getElementById("program-mode-text");
  const notice = document.getElementById("program-notice");

  let programData = null;


  // ---------------------------------------------------------
  // LOCAL DATE - avoids UTC date shifting
  // ---------------------------------------------------------

  function getLocalISODate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }


  function formatHindiDate(value) {
    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("hi-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }


  // ---------------------------------------------------------
  // Find special program
  // ---------------------------------------------------------

  function findSpecialProgram(date) {
    const dates = Array.isArray(programData.specialDates)
      ? programData.specialDates
      : [];

    return dates.find(entry =>
      entry &&
      entry.date === date &&
      Array.isArray(entry.items)
    ) || null;
  }


  // ---------------------------------------------------------
  // Get program for selected date
  // Special if present, otherwise daily
  // ---------------------------------------------------------

  function getProgram(date) {
    const special = findSpecialProgram(date);

    if (special) {
      return {
        type: "special",
        date,
        label: special.label || formatHindiDate(date),
        items: Array.isArray(special.items) ? special.items : []
      };
    }

    const daily = programData.daily || {};

    return {
      type: "daily",
      date,
      label: daily.label || "दैनिक कार्यक्रम",
      items: Array.isArray(daily.items) ? daily.items : []
    };
  }


  // ---------------------------------------------------------
  // Create one program row
  // ---------------------------------------------------------

  function createProgramItem(item, isSpecial) {

    const row = document.createElement("article");
    row.className = `program-item${isSpecial ? " is-special" : ""}`;

    const time = document.createElement("span");
    time.className = "program-time";
    time.textContent = item.time || "";

    const content = document.createElement("div");

    const task = document.createElement("div");
    task.className = "program-task";
    task.textContent = item.task || "";

    content.appendChild(task);

    if (item.description && String(item.description).trim()) {
      const description = document.createElement("div");
      description.className = "program-description";
      description.textContent = item.description;
      content.appendChild(description);
    }

    row.appendChild(time);
    row.appendChild(content);

    return row;
  }


  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  function render(date) {

    const program = getProgram(date);
    const isSpecial = program.type === "special";

    selectedDateLabel.textContent = formatHindiDate(date);
    programDate.textContent = formatHindiDate(date);

    programType.textContent =
      isSpecial ? "विशेष कार्यक्रम" : "दैनिक कार्यक्रम";

    programTitle.textContent =
      isSpecial
        ? "आज का विशेष कार्यक्रम"
        : "दैनिक कार्यक्रम";

    modeIcon.textContent = isSpecial ? "✨" : "📅";

    modeText.textContent =
      isSpecial
        ? "इस तारीख का विशेष कार्यक्रम"
        : "दैनिक कार्यक्रम लागू है";

    programList.innerHTML = "";

    if (!program.items.length) {
      programEmpty.hidden = false;
      return;
    }

    programEmpty.hidden = true;

    program.items.forEach(item => {
      if (!item || !item.time || !item.task) {
        return;
      }

      programList.appendChild(
        createProgramItem(item, isSpecial)
      );
    });


    // Explicitly explain fallback when no special calendar exists.
    if (!isSpecial) {
      notice.innerHTML = `
        <span class="notice-icon">ℹ</span>
        <span>
          इस तारीख के लिए कोई विशेष कार्यक्रम सेट नहीं है,
          इसलिए दैनिक कार्यक्रम दिखाया जा रहा है।
        </span>
      `;
    } else {
      notice.innerHTML = `
        <span class="notice-icon">✨</span>
        <span>
          इस तारीख के लिए विशेष कार्यक्रम उपलब्ध है।
        </span>
      `;
    }
  }


  // ---------------------------------------------------------
  // Date picker
  // ---------------------------------------------------------

  picker.addEventListener("change", () => {
    if (!picker.value) {
      return;
    }

    render(picker.value);
  });


  // ---------------------------------------------------------
  // Load JSON
  // ---------------------------------------------------------

  async function load() {

    try {

      const response = await fetch(
        `${DATA_URL}?v=${Date.now()}`
      );

      if (!response.ok) {
        throw new Error(
          `Unable to load program.json (${response.status})`
        );
      }

      programData = await response.json();

      if (!programData || typeof programData !== "object") {
        throw new Error("Invalid program.json format.");
      }

      const today = getLocalISODate();

      picker.value = today;

      render(today);

      console.log("Program data loaded.");
      console.log("Selected date:", today);

    } catch (error) {

      console.error("Program page error:", error);

      programList.innerHTML = "";
      programEmpty.hidden = false;
      programEmpty.textContent =
        "कार्यक्रम की जानकारी लोड नहीं हो सकी।";
    }
  }


  load();

});
