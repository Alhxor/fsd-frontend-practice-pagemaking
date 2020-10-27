document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown");
  dropdowns.forEach((dropdown) => Dropdown(dropdown));
});

/**
 * [!] Problem: how to receive events from content? (closing, changing title, etc.)
 *      currently we're only talking to it through sessionStorage
 *      solution #1: dispatching custom events?
 *      solution #2: just find the required element and do stuff to it
 *      solution #3: have a special class that other component will apply functionality to
 */

function Dropdown(node) {
  const id = node.id;
  const text = node.querySelector(".dropdown__text");
  const defaultText = text.textContent;
  const dataKey = node.dataset.datakey;
  const content = document.querySelector(`#${id}+.dropdown__content`);

  // dropdown expand / collapse
  const toggle = () => {
    node.classList.toggle("dropdown--expanded");
    content.classList.toggle("hidden");

    let data = sessionStorage.getItem(dataKey)
    if (data) {
      text.textContent = data
    } else text.textContent = defaultText
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