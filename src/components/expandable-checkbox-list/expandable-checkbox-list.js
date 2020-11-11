document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".expandable-checkbox-list").forEach((el) => {
    ExpandableCheckboxList(el);
  });
});

function ExpandableCheckboxList(node) {
  const title = node.querySelector(".expandable-checkbox-list__title")

  title.addEventListener("click", () => {
    node.classList.toggle("expandable-checkbox-list--expanded")
  })
}
