document.addEventListener("DOMContentLoaded", () => {
  const DateDropdowns = document.querySelectorAll(".date-dropdown");
  DateDropdowns.forEach(DateDropdown);
});

/**
 * [?] How do we reuse Dropdown component for looks?
 */

function DateDropdown(node) {
  const id = node.id
  console.log("Loaded DateDropdown with id " + id)
}