import "@/components/common/dropdown/dropdown"
import { subscribe } from "@/util/events";

document.addEventListener("DOMContentLoaded", () => {
  const DateDropdowns = document.querySelectorAll(".date-dropdown");
  DateDropdowns.forEach(DateDropdown);
});

function DateDropdown(node) {
  const id = node.id;
  const dataKey = node.dataset.datakey;
  const [left, right] = node.querySelectorAll(".dropdown__text");
  const defaultText = left.textContent;

  const setDate = (textNode, date) => {
    if (date)
      textNode.textContent = new Date(parseInt(date)).toLocaleDateString(
        "ru-RU"
      );
    else textNode.textContent = defaultText;
  };

  subscribe(dataKey + "/setStartDate", ({ date }) => {
    setDate(left, date);
  });

  subscribe(dataKey + "/setEndDate", ({ date }) => {
    setDate(right, date);
  });
}
