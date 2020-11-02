import "@/components/common/dropdown/dropdown";
import { subscribe, dispatch } from "@/util/events";

document.addEventListener("DOMContentLoaded", () => {
  const FilterDateDropdowns = document.querySelectorAll(
    ".filter-date-dropdown"
  );
  FilterDateDropdowns.forEach(FilterDateDropdown);
});

function FilterDateDropdown(node) {
  const dataKey = node.dataset.datakey;
  let start = "";
  let end = "";

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

  const SHORT_MONTHS = MONTHS.map((m) => m.substr(0, 3).toLowerCase());

  const formatDate = (dateInMs) => {
    let date = new Date(parseInt(dateInMs));
    let day = date.getDate();
    if (day < 10) day = `0${day}`;

    return `${day} ${SHORT_MONTHS[date.getMonth()]}`;
  };

  const updateDate = () => {
    if (start && end)
      dispatch(dataKey + "/updateText", { text: `${start} - ${end}` });
    else dispatch(dataKey + "/updateText");
  };

  subscribe(dataKey + "/setStartDate", ({ date }) => {
    if (date) {
      start = formatDate(date);
    } else start = "";
    updateDate();
  });

  subscribe(dataKey + "/setEndDate", ({ date }) => {
    if (date) {
      end = formatDate(date);
    } else end = "";
    updateDate();
  });
}
