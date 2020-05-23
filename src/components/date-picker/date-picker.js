document.addEventListener("DOMContentLoaded", () => {
  const DatePickers = document.querySelectorAll(".date-picker");
  DatePickers.forEach(DatePicker);
});

function DatePicker(node) {
  const heading = node.querySelector(".date-picker__heading");
  const previous = node.querySelector(".date-picker__previous");
  const next = node.querySelector(".date-picker__next");
  let page = node.querySelector(".days-grid__days");

  const today = new Date();

  let year = today.getFullYear();
  let month = today.getMonth();

  displayCalendarPage(year, month);

  previous.addEventListener("click", () => {
    if (month === 0) displayCalendarPage(year - 1, 11);
    else displayCalendarPage(year, month - 1);
  });

  next.addEventListener("click", () => {
    if (month === 11) displayCalendarPage(year + 1, 0);
    else displayCalendarPage(year, month + 1);
  });

  function displayCalendarPage(newYear, newMonth) {
    const newCalendarPage = CalendarPage(newYear, newMonth);
    heading.textContent = `${MONTHS[newMonth]} ${newYear}`;
    page.replaceWith(newCalendarPage);

    page = node.querySelector(".days-grid__days");
    month = newMonth;
    year = newYear;
  }
}

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

/**
 * Creates calendar grid for a given year & month
 * @param {number} year
 * @param {number} month
 * @returns {Node}
 */
function CalendarPage(year, month) {
  // date = 0 means last day of previous month
  const daysInLastMonth = new Date(year, month, 0).getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekDay = new Date(year, month, 1).getDay();
  const now = new Date();

  const { daysLastMonth, days, daysNextMonth } = getCalendarDays(
    daysInLastMonth,
    daysInMonth,
    firstWeekDay
  );

  const calendarGrid = document.createElement("div");
  calendarGrid.className = "days-grid__days";

  appendCells(
    daysLastMonth,
    "days-grid__cell days-grid__cell--not-this-month",
    calendarGrid
  );

  if (year === now.getFullYear() && month === now.getMonth()) {
    const dateNow = now.getDate();
    const daysUntilToday = days.slice(0, dateNow - 1);
    const today = [days[dateNow - 1]];
    const daysAfterToday = days.slice(dateNow);
    appendCells(daysUntilToday, "days-grid__cell", calendarGrid);
    appendCells(today, "days-grid__cell days-grid__cell--today", calendarGrid);
    appendCells(daysAfterToday, "days-grid__cell", calendarGrid);
  } else appendCells(days, "days-grid__cell", calendarGrid);

  appendCells(
    daysNextMonth,
    "days-grid__cell days-grid__cell--not-this-month",
    calendarGrid
  );

  return calendarGrid;
}

/**
 * Helper function for DatePicker, creates and appends cells to a calendar grid
 * @param {array<number>} days
 * @param {string} className class name for each cell
 * @param {Node} parent HTML Node to append cells to
 */
function appendCells(days, className, parent) {
  for (let day of days) {
    let cell = document.createElement("span");
    cell.className = className;
    cell.textContent = day;
    parent.appendChild(cell);
  }
}

/**
 * Helper function for DatePicker, generates days to display in calendar grid
 * @param {number} daysInLastMonth 28-31
 * @param {number} daysInMonth 28-31
 * @param {number} firstWeekDay 0-6
 * @returns {object} e.g. { daysLastMonth: [29, 30], days: [1, ..., 30], daysNextMonth: [1, 2] }
 */
function getCalendarDays(daysInLastMonth, daysInMonth, firstWeekDay) {
  const daysToDisplayInLastMonth =
    firstWeekDay === 0 // we want Sunday in last column instead of first
      ? 6
      : firstWeekDay - 1;

  // 42 is 6*7, total number of days displayed in calendar page
  const daysToDisplayInNextMonth = 42 - daysToDisplayInLastMonth - daysInMonth;

  const firstDayToDisplayInLastMonth =
    daysInLastMonth - daysToDisplayInLastMonth + 1;

  let daysLastMonth = generateDays(
    firstDayToDisplayInLastMonth,
    daysToDisplayInLastMonth
  );
  let days = generateDays(1, daysInMonth);
  let daysNextMonth = generateDays(1, daysToDisplayInNextMonth);

  function generateDays(start, length) {
    let result = [];
    for (let day = start; result.length < length; day++) result.push(day);
    return result;
  }

  return { daysLastMonth, days, daysNextMonth };
}
