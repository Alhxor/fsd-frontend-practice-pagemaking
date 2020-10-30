import { subscribe } from "@/util/events";

document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown");
  dropdowns.forEach((dropdown) => Dropdown(dropdown));
});

function Dropdown(node) {
  const id = node.id;
  const text = node.querySelector(".dropdown__text");
  const defaultText = text.textContent;
  const dataKey = node.dataset.datakey;
  const content = document.querySelector(`#${id}+.dropdown__content`);

  subscribe(dataKey + "/updateText", (payload) => {
    if (payload.text) text.textContent = payload.text;
    else text.textContent = defaultText;
  });

  subscribe(dataKey + "/close", (payload) => {
    close();
  });

  // dropdown expand / collapse
  const toggle = () => {
    node.classList.toggle("dropdown--expanded");
    content.classList.toggle("hidden");
  };

  const close = () => {
    node.classList.remove("dropdown--expanded");
    content.classList.add("hidden");
  };

  node.addEventListener("click", () => toggle());

  // collapse when user clicks the page
  document.addEventListener("click", ({ target }) => {
    if (!node.contains(target) && !content.contains(target)) close();
  });
}
