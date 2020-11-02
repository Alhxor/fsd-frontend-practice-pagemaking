import { subscribe, dispatch } from "@/util/events";

document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown");
  dropdowns.forEach((dropdown) => Dropdown(dropdown));
});

function Dropdown(node) {
  // const id = node.id;
  const text = node.querySelector(".dropdown__text");
  const defaultText = text.textContent;
  const dataKey = node.dataset.datakey;
  const content = document.querySelector(`#${node.dataset.contentid}`);
  const isSeparate = content.classList.contains("dropdown__content--separate");
  let isOpen = false;

  subscribe(dataKey + "/updateText", (payload) => {
    if (payload.text) text.textContent = payload.text;
    else text.textContent = defaultText;
  });

  subscribe(dataKey + "/close", () => {
    close();
    isOpen = false;
  });

  subscribe(dataKey + "/open", () => {
    open();
    isOpen = true;
  });

  // dropdown expand / collapse
  const toggle = () => {
    if (isOpen) dispatch(dataKey + "/close");
    else dispatch(dataKey + "/open");
  };

  const open = () => {
    if (!isSeparate) node.classList.add("dropdown--sharpen-bottom-border");
    node.classList.add("dropdown--highlight-border");
    content.classList.remove("hidden");
  };

  const close = () => {
    node.classList.remove("dropdown--highlight-border");
    node.classList.remove("dropdown--sharpen-bottom-border");
    content.classList.add("hidden");
  };

  node.addEventListener("click", () => toggle());

  // collapse when user clicks the page
  document.addEventListener("click", ({ target }) => {
    const container = node.closest(".container-relative");
    if (isOpen && !container.contains(target) && !content.contains(target))
      dispatch(dataKey + "/close");
  });
}
