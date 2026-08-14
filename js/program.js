// =========================================================
// DAINIK KARYAKRAM
// Collapsible special-date calendar
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  const DATA_URL = "./data/program.json";

  // -------------------------------------------------------
  // Main page elements
  // -------------------------------------------------------

  const picker =
    document.getElementById("program-date-picker");

  const selectedDateLabel =
    document.getElementById("selected-date-label");

  const notice =
    document.getElementById("program-notice");

  const list =
    document.getElementById("program-list");

  const empty =
    document.getElementById("program-empty");

  const dateLabel =
    document.getElementById("program-date");

  const typeLabel =
    document.getElementById("program-type");

  const title =
    document.getElementById("program-title");

  const modeIcon =
    document.getElementById("program-mode-icon");

  const modeText =
    document.getElementById("program-mode-text");

  const programPanel =
    document.querySelector(".program-panel");


  // -------------------------------------------------------
  // Calendar elements
  // -------------------------------------------------------

  const calendarToggle =
    document.getElementById("calendar-toggle");

  const calendarPanel =
    document.getElementById("calendar-panel");

  const calendarToggleIcon =
    document.getElementById("calendar-toggle-icon");

  const specialDateCount =
    document.getElementById("special-date-count");

  const monthTitle =
    document.getElementById("calendar-month");

  const calendarGrid =
    document.getElementById("calendar-grid");

  const previousButton =
    document.getElementById("calendar-prev");

  const nextButton =
    document.getElementById("calendar-next");


  // -------------------------------------------------------
  // State
  // -------------------------------------------------------

  let data = null;

  let selectedDate = "";

  let visibleMonth = new Date();


  // -------------------------------------------------------
  // DATE HELPERS
  // -------------------------------------------------------

  function localISO(date = new Date()) {

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");

  }


  function fromISO(value) {

    return new Date(`${value}T00:00:00`);

  }


  function formatDate(value) {

    const date =
      fromISO(value);

    return new Intl.DateTimeFormat(
      "hi-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    ).format(date);

  }


  function formatMonth(date) {

    return new Intl.DateTimeFormat(
      "hi-IN",
      {
        month: "long",
        year: "numeric"
      }
    ).format(date);

  }


  // -------------------------------------------------------
  // SPECIAL DATE HELPERS
  // -------------------------------------------------------

  function specialDates() {

    if (!Array.isArray(data?.specialDates)) {
      return [];
    }

    return data.specialDates.filter(
      item =>
        item &&
        /^\d{4}-\d{2}-\d{2}$/.test(item.date)
    );

  }


  function specialFor(date) {

    return (
      specialDates().find(
        item => item.date === date
      ) || null
    );

  }


  function getProgram(date) {

    const special =
      specialFor(date);

    if (special) {

      return {
        special: true,

        items:
          Array.isArray(special.items)
            ? special.items
            : []
      };

    }

    return {

      special: false,

      items:
        Array.isArray(data?.daily?.items)
          ? data.daily.items
          : []

    };

  }


  // -------------------------------------------------------
  // CALENDAR TOGGLE
  // -------------------------------------------------------

  function closeCalendar() {

    if (calendarPanel) {

      calendarPanel.classList.remove(
        "open"
      );

      calendarPanel.setAttribute(
        "aria-hidden",
        "true"
      );

    }

    if (calendarToggle) {

      calendarToggle.classList.remove(
        "open"
      );

      calendarToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  }


  function openCalendar() {

    if (calendarPanel) {

      calendarPanel.classList.add(
        "open"
      );

      calendarPanel.setAttribute(
        "aria-hidden",
        "false"
      );

    }

    if (calendarToggle) {

      calendarToggle.classList.add(
        "open"
      );

      calendarToggle.setAttribute(
        "aria-expanded",
        "true"
      );

    }

  }


  function setupCalendarToggle() {

    if (
      !calendarToggle ||
      !calendarPanel
    ) {
      return;
    }

    calendarToggle.addEventListener(
      "click",
      () => {

        const isOpen =
          calendarPanel.classList.contains(
            "open"
          );

        if (isOpen) {
          closeCalendar();
        } else {
          openCalendar();
        }

      }
    );

  }


  // -------------------------------------------------------
  // SPECIAL DATE COUNT
  // -------------------------------------------------------

  function updateSpecialDateCount() {

    if (!specialDateCount) {
      return;
    }

    const count =
      specialDates().length;

    if (count === 0) {

      specialDateCount.textContent =
        "अभी कोई विशेष दिन निर्धारित नहीं है";

      return;

    }

    specialDateCount.textContent =
      `${count} विशेष दिन उपलब्ध हैं`;

  }


  // -------------------------------------------------------
  // RENDER PROGRAM
  // -------------------------------------------------------

  function renderProgram(date) {

    selectedDate =
      date;

    const program =
      getProgram(date);


    if (selectedDateLabel) {

      selectedDateLabel.textContent =
        formatDate(date);

    }


    if (dateLabel) {

      dateLabel.textContent =
        formatDate(date);

    }


    if (typeLabel) {

      typeLabel.textContent =
        program.special
          ? "विशेष कार्यक्रम"
          : "दैनिक कार्यक्रम";

    }


    if (title) {

      title.textContent =
        program.special
          ? "इस तारीख का विशेष कार्यक्रम"
          : "दैनिक कार्यक्रम";

    }


    if (modeIcon) {

      modeIcon.textContent =
        program.special
          ? "✨"
          : "📅";

    }


    if (modeText) {

      modeText.textContent =
        program.special
          ? "विशेष कार्यक्रम उपलब्ध है"
          : "दैनिक कार्यक्रम";

    }


    // -----------------------------------------------------
    // Notice
    // -----------------------------------------------------

    if (notice) {

      notice.innerHTML =
        program.special

          ? `
            <span class="notice-icon">✨</span>
            <span>
              इस तारीख के लिए विशेष कार्यक्रम निर्धारित है।
            </span>
          `

          : `
            <span class="notice-icon">ℹ</span>
            <span>
              इस तारीख के लिए कोई विशेष कैलेंडर सेट नहीं है,
              इसलिए दैनिक कैलेंडर दिखाया जा रहा है।
            </span>
          `;

    }


    // -----------------------------------------------------
    // Program list
    // -----------------------------------------------------

    if (!list) {
      return;
    }

    list.innerHTML = "";


    if (!program.items.length) {

      if (empty) {
        empty.hidden = false;
      }

    } else {

      if (empty) {
        empty.hidden = true;
      }


      program.items.forEach(item => {

        if (
          !item ||
          !item.time ||
          !item.task
        ) {
          return;
        }


        const row =
          document.createElement("article");

        row.className =
          `program-item${
            program.special
              ? " is-special"
              : ""
          }`;


        const time =
          document.createElement("span");

        time.className =
          "program-time";

        time.textContent =
          item.time;


        const content =
          document.createElement("div");


        const task =
          document.createElement("div");

        task.className =
          "program-task";

        task.textContent =
          item.task;


        content.appendChild(task);


        if (
          item.description &&
          String(item.description).trim()
        ) {

          const description =
            document.createElement("div");

          description.className =
            "program-description";

          description.textContent =
            item.description;

          content.appendChild(
            description
          );

        }


        row.appendChild(time);

        row.appendChild(content);

        list.appendChild(row);

      });

    }


    // -----------------------------------------------------
    // Move calendar to selected month
    // -----------------------------------------------------

    const selected =
      fromISO(date);

    visibleMonth =
      new Date(
        selected.getFullYear(),
        selected.getMonth(),
        1
      );

    renderCalendar();

  }


  // -------------------------------------------------------
  // RENDER CALENDAR
  // -------------------------------------------------------

  function renderCalendar() {

    if (
      !calendarGrid ||
      !monthTitle
    ) {
      return;
    }


    calendarGrid.innerHTML = "";

    monthTitle.textContent =
      formatMonth(visibleMonth);


    const year =
      visibleMonth.getFullYear();

    const month =
      visibleMonth.getMonth();


    const firstDay =
      new Date(
        year,
        month,
        1
      ).getDay();


    const days =
      new Date(
        year,
        month + 1,
        0
      ).getDate();


    const previousDays =
      new Date(
        year,
        month,
        0
      ).getDate();


    // 42 cells keeps calendar height stable.
    for (
      let cell = 0;
      cell < 42;
      cell++
    ) {

      const button =
        document.createElement("button");

      button.type =
        "button";

      button.className =
        "calendar-day";


      let day;

      let date;

      let currentMonth =
        true;


      // Previous month
      if (cell < firstDay) {

        day =
          previousDays -
          firstDay +
          cell +
          1;

        date =
          localISO(
            new Date(
              year,
              month - 1,
              day
            )
          );

        currentMonth =
          false;

      }

      // Next month
      else if (
        cell >=
        firstDay + days
      ) {

        day =
          cell -
          firstDay -
          days +
          1;

        date =
          localISO(
            new Date(
              year,
              month + 1,
              day
            )
          );

        currentMonth =
          false;

      }

      // Current month
      else {

        day =
          cell -
          firstDay +
          1;

        date =
          `${year}-${String(
            month + 1
          ).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;

      }


      button.textContent =
        day;


      // ---------------------------------------------------
      // Outside current month
      // ---------------------------------------------------

      if (!currentMonth) {

        button.classList.add(
          "other-month"
        );

        button.disabled =
          true;

        calendarGrid.appendChild(
          button
        );

        continue;

      }


      // ---------------------------------------------------
      // Special date
      // ---------------------------------------------------

      const special =
        specialFor(date);

      if (special) {

        button.classList.add(
          "special"
        );

        button.title =
          special.label ||
          "विशेष कार्यक्रम";

      }


      // ---------------------------------------------------
      // Today
      // ---------------------------------------------------

      if (
        date ===
        localISO()
      ) {

        button.classList.add(
          "today"
        );

      }


      // ---------------------------------------------------
      // Selected
      // ---------------------------------------------------

      if (
        date ===
        selectedDate
      ) {

        button.classList.add(
          "selected"
        );

      }


      // ---------------------------------------------------
      // Click
      // ---------------------------------------------------

      button.addEventListener(
        "click",
        () => {

          if (picker) {
            picker.value =
              date;
          }

          renderProgram(date);

          // Close calendar after selection
          closeCalendar();

          // Keep the selected program visible
          if (programPanel) {
            programPanel.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }

        }
      );


      calendarGrid.appendChild(
        button
      );

    }

  }


  // -------------------------------------------------------
  // MONTH NAVIGATION
  // -------------------------------------------------------

  if (previousButton) {

    previousButton.addEventListener(
      "click",
      () => {

        visibleMonth =
          new Date(
            visibleMonth.getFullYear(),
            visibleMonth.getMonth() - 1,
            1
          );

        renderCalendar();

      }
    );

  }


  if (nextButton) {

    nextButton.addEventListener(
      "click",
      () => {

        visibleMonth =
          new Date(
            visibleMonth.getFullYear(),
            visibleMonth.getMonth() + 1,
            1
          );

        renderCalendar();

      }
    );

  }


  // -------------------------------------------------------
  // DATE PICKER
  // -------------------------------------------------------

  if (picker) {

    picker.addEventListener(
      "change",
      () => {

        if (!picker.value) {
          return;
        }

        renderProgram(
          picker.value
        );

      }
    );

  }


  // -------------------------------------------------------
  // LOAD DATA
  // -------------------------------------------------------

  async function load() {

    try {

      const response =
        await fetch(
          `${DATA_URL}?v=${Date.now()}`
        );


      if (!response.ok) {

        throw new Error(
          `Unable to load program.json (${response.status})`
        );

      }


      data =
        await response.json();


      // Update number of special dates
      updateSpecialDateCount();


      // Setup toggle only once
      setupCalendarToggle();


      // Today
      const today =
        localISO();


      if (picker) {

        picker.value =
          today;

      }


      renderProgram(today);


      console.log(
        "Special program dates:",
        specialDates().map(
          item => item.date
        )
      );


    } catch (error) {

      console.error(
        "Program page error:",
        error
      );


      if (empty) {

        empty.hidden =
          false;

        empty.textContent =
          "कार्यक्रम की जानकारी लोड नहीं हो सकी।";

      }

    }

  }


  // -------------------------------------------------------
  // Start
  // -------------------------------------------------------

  load();

});
