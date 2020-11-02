import { dispatch } from "@/util/events";

document.addEventListener("DOMContentLoaded", () => {
  const DatePickers = document.querySelectorAll(".date-picker");
  DatePickers.forEach(DatePicker);
});

/**
 * localStorage NO LONGER used to save selection data and share it with other components
 *  (dispatch utility is used instead)
 * sessionStorage is used for saving internal state, does not use component id
 * [!] It can cause problems when 2 or more date-pickers are on the same page
 *      TODO: change it to use current id in the sessionStorage key
 */

function DatePicker(node) {
  const id = node.id;
  const dataKey = node.dataset.datakey;
  const [clear, apply] = node.querySelectorAll(".date-picker__control");
  const heading = node.querySelector(".date-picker__heading");
  const previous = node.querySelector(".date-picker__previous");
  const next = node.querySelector(".date-picker__next");
  let page = node.querySelector(".days-grid__days");

  const today = new Date();

  let year = today.getFullYear();
  let month = today.getMonth();

  displayCalendarPage(year, month);
  saveDateState(year, month);

  previous.addEventListener("click", () => {
    if (month === 0) displayCalendarPage(year - 1, 11);
    else displayCalendarPage(year, month - 1);
  });

  next.addEventListener("click", () => {
    if (month === 11) displayCalendarPage(year + 1, 0);
    else displayCalendarPage(year, month + 1);
  });

  apply.addEventListener("click", () => {
    const start = sessionStorage.getItem("dp-highlight-start");
    const end = sessionStorage.getItem("dp-highlight-end");

    dispatch(dataKey + "/setStartDate", { date: start });
    dispatch(dataKey + "/setEndDate", { date: end });
    // if (start) localStorage.setItem(id + "-start", start);
    // if (end) localStorage.setItem(id + "-end", end);

    clear.classList.remove("invisible");
  });

  clear.addEventListener("click", () => {
    dispatch(dataKey + "/setStartDate");
    dispatch(dataKey + "/setEndDate");

    // localStorage.removeItem(id + "-start");
    // localStorage.removeItem(id + "-end");

    clear.classList.add("invisible");
  });

  function saveDateState(year, month) {
    sessionStorage.setItem("dp-visible-year", year);
    sessionStorage.setItem("dp-visible-month", month);
  }

  function displayCalendarPage(newYear, newMonth) {
    const newCalendarPage = CalendarPage(newYear, newMonth);
    heading.textContent = `${MONTHS[newMonth]} ${newYear}`;
    page.replaceWith(newCalendarPage);

    page = node.querySelector(".days-grid__days");
    month = newMonth;
    year = newYear;

    saveDateState(year, month);

    const start = parseInt(sessionStorage.getItem("dp-highlight-start"));
    const end = parseInt(sessionStorage.getItem("dp-highlight-end"));

    if (!start || !end) return;

    const startDate = new Date(start);
    const endDate = new Date(end);

    const classStart = "days-grid__cell--range-start";
    const classEnd = "days-grid__cell--range-end";

    const startCell = getCellFromDate(startDate, page);
    const endCell = getCellFromDate(endDate, page);

    if (startCell) startCell.classList.add(classStart);
    if (endCell) endCell.classList.add(classEnd);

    if (!startCell && !endCell) {
      if (
        month >= startDate.getMonth() &&
        month <= endDate.getMonth() &&
        year >= startDate.getFullYear() &&
        year <= endDate.getFullYear()
      )
        highlightCellsRange(page, startDate, endDate);
      else return;
    }

    highlightCellsRange(page, startDate, endDate);
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

function onCellClick({ target }) {
  const date = getDateFromCell(target);
  smartCellHighlight(target, date);
}

/**
 * @param {Date} date JS Date object
 * @param {number} days number of days to add
 * @returns {Date} Date advanced by number of days
 */
function addDays(date, days) {
  const msPerDay = 24 * 3600 * 1000;
  return new Date(Number(date) + days * msPerDay);
}

/**
 * Returns a Range on a calendar page between start and end dates
 * If start or end are on another page will select until start / end of the page itself
 * @param {Node} page Calendar page in date-picker
 * @param {Date} start
 * @param {Date} end
 * @returns {Range} JS Range object
 */
function createCellRange(page, start, end) {
  if (!page || !start || !end) return null;

  start = addDays(start, 1);
  end = addDays(end, -1);

  let cellStart = getCellFromDate(start, page);
  let cellEnd = getCellFromDate(end, page);
  let range = new Range();

  if (cellStart) range.setStart(cellStart, 0);
  else range.setStart(page.firstChild, 0);

  if (cellEnd) range.setEnd(cellEnd, 0);
  else range.setEnd(page.lastChild, 0);

  return range;
}

/**
 * Helper function for date-picker
 * Highlights a range of cells on the calendar page in two clicks (from, to)
 * 3rd call clears selection
 * @param {Node} clickedCell A calendar cell which user has just clicked on
 * @param {Date} cellDate Date in the clicked cell
 */
function smartCellHighlight(clickedCell, cellDate) {
  // big and hacky, not optimized, but simple
  // TODO: handle backwards selection between different months

  const page = clickedCell.parentNode;
  const classStart = "days-grid__cell--range-start";
  const classEnd = "days-grid__cell--range-end";

  let start = parseInt(sessionStorage.getItem("dp-highlight-start"));
  let end = parseInt(sessionStorage.getItem("dp-highlight-end"));

  if (!start) {
    clickedCell.classList.add(classStart);
    sessionStorage.setItem("dp-highlight-start", Number(cellDate));
    return;
  }

  if (!end) {
    end = Number(cellDate);

    if (new Date(start) > new Date(end)) {
      // reverse selection, swap start with end
      let savedStart = start;
      start = end;
      end = savedStart;
      sessionStorage.setItem("dp-highlight-start", start);

      const cellStart = page.querySelector(`.${classStart}`);
      if (cellStart) {
        cellStart.classList.remove(classStart);
        cellStart.classList.add(classEnd);
      }
      clickedCell.classList.add(classStart);
    } else clickedCell.classList.add(classEnd);

    sessionStorage.setItem("dp-highlight-end", end);

    highlightCellsRange(page, new Date(start), new Date(end));

    return;
  }

  // remove all highlighting on 3rd call (click)
  clearCellsHighlighting(page);
}

/**
 * @param {Node} page Calendar page in date-picker
 * @param {Date} start
 * @param {Date} end
 */
function highlightCellsRange(page, start, end) {
  const classHighlight = "days-grid__cell--range";
  const cells = page.querySelectorAll(".days-grid__cell");
  const highlightRange = createCellRange(page, start, end);

  for (let cell of cells) {
    if (highlightRange.isPointInRange(cell, 0))
      cell.classList.add(classHighlight);
  }
}

/**
 * @param {Node} page Calendar page in date-picker
 */
function clearCellsHighlighting(page) {
  const classStart = "days-grid__cell--range-start";
  const classEnd = "days-grid__cell--range-end";
  const classHighlight = "days-grid__cell--range";

  sessionStorage.removeItem("dp-highlight-start");
  sessionStorage.removeItem("dp-highlight-end");

  let cellStart = page.querySelector(`.${classStart}`);
  if (cellStart) cellStart.classList.remove(classStart);

  let cellsHighlighted = page.querySelectorAll(`.${classHighlight}`);
  if (cellsHighlighted)
    cellsHighlighted.forEach((cell) => cell.classList.remove(classHighlight));

  let cellEnd = page.querySelector(`.${classEnd}`);
  if (cellEnd) cellEnd.classList.remove(classEnd);
}

/**
 * Helper function for onCellClick, returns a full date for a given calendar cell
 * @param {Node} cell A calendar cell in date-picker
 * @returns {Date} JS Date object
 */
function getDateFromCell(cell) {
  let year = parseInt(sessionStorage.getItem("dp-visible-year"));
  let month = parseInt(sessionStorage.getItem("dp-visible-month"));
  const date = parseInt(cell.textContent);

  if (cell.classList.contains("days-grid__cell--not-this-month"))
    if (date < 15)
      if (month !== 11) month++;
      else {
        month = 0;
        year++;
      }
    else if (month !== 0) month--;
    else {
      month = 11;
      year--;
    }

  return new Date(year, month, date);
}

/**
 * Finds a calendar cell that matches a given Date object
 * Depends on current visible year & month saved in sessionStorage
 * @param {Date} date JS Date object to find in a calendar page
 * @param {Node} page DOM Node - calendar page
 * @param {number} pageYear Currently visible year
 * @param {number} pageMonth Currently visible month
 * @returns {Node} Calendar cell with a given date or null if nothing found
 */
function getCellFromDate(date, page) {
  const pageYear = parseInt(sessionStorage.getItem("dp-visible-year"));
  const pageMonth = parseInt(sessionStorage.getItem("dp-visible-month"));
  const month = date.getMonth();
  const day = date.getDate();

  const msDay = 24 * 60 * 60 * 1000;
  const pageCenter = new Date(pageYear, pageMonth, 15);
  const difference = Math.abs(date - pageCenter);

  if (difference > 28 * msDay) return null;

  if (month === pageMonth) {
    for (let cell of page.children)
      if (
        parseInt(cell.textContent) === day &&
        !cell.classList.contains("days-grid__cell--not-this-month")
      )
        return cell;
  } else
    for (let cell of page.children)
      if (
        parseInt(cell.textContent) === day &&
        cell.classList.contains("days-grid__cell--not-this-month")
      )
        return cell;
  return null;
}

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
    cell.addEventListener("click", onCellClick);
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
