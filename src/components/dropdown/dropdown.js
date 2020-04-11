document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown");
  dropdowns.forEach((dropdown) => Dropdown(dropdown));
});

export function Dropdown(node) {
  const id = node.id;
  const title = node.querySelector(".dropdown__select");
  const defaultTitle = title.textContent;
  const titlePlural = title.dataset.plural;
  const content = document.querySelector(`#${id}+.dropdown__content`);
  const options = content.querySelectorAll(".option");
  const optionValues = content.querySelectorAll(".option__value");
  const [clear, apply] = content.querySelectorAll(".dropdown__control");

  // load data from localStorage and render it to content
  const data = JSON.parse(localStorage.getItem(id));
  if (data) {
    title.textContent = `${data.total} ${getPluralForm(
      data.total,
      titlePlural
    )}`;
    optionValues.forEach((span, idx) => (span.textContent = data.values[idx]));
    clear.classList.remove("invisible");
  }

  // dropdown expand / collapse
  node.addEventListener("click", () => {
    node.classList.toggle("dropdown--expanded");
    content.classList.toggle("hidden");
  });

  // save state data to localStorage
  apply.addEventListener("click", () => {
    let values = [...optionValues].map((span) => parseInt(span.textContent));
    let sum = values.reduce((x, y) => x + y);
    let data = {
      total: sum,
      values: values,
    };
    localStorage.setItem(id, JSON.stringify(data));
    clear.classList.remove("invisible");
    title.textContent = `${sum} ${getPluralForm(sum, titlePlural)}`;
  });

  // clear state data from localStorage
  clear.addEventListener("click", () => {
    localStorage.removeItem(id);
    clear.classList.add("invisible");
    title.textContent = defaultTitle;
    optionValues.forEach((span) => (span.textContent = 0));
  });

  // events for - and + buttons in options
  options.forEach((option) => {
    let [decrement, increment] = option.querySelectorAll(".increment");
    let value = option.querySelector(".option__value");

    decrement.addEventListener("click", () =>
      changeValueByOne(decrement, value, (increment = false))
    );
    increment.addEventListener("click", () =>
      changeValueByOne(decrement, value, (increment = true))
    );
  });
}

/**
 * Helper function for decrement / increment conrols in dropdown option
 * @param {node} refBtnDec reference to decrement button
 * @param {node} refValue reference to value
 * @param {boolean} increment increase value by one if true, decrease otherwise
 */
function changeValueByOne(refBtnDec, refValue, increment = true) {
  const change = increment ? 1 : -1;
  const value = parseInt(refValue.textContent);
  const newValue = value + change;

  if (newValue === 0)
    // no more decrements allowed, disable button
    refBtnDec.classList.add("increment--disabled");

  if (value === 0 && newValue === 1)
    // enable it back
    refBtnDec.classList.remove("increment--disabled");

  refValue.textContent = newValue;
}

/**
 * Helper function for choosing 1 of 3 plural forms
 * @param {number} num number of entities
 * @param {string} variants "form1,form2,form3"
 * @returns {string} form1, form2 or form3
 */
function getPluralForm(num, variants) {
  const lastDigit = parseInt(num.toString().slice(-1));
  if (!variants) return "total";

  const forms = variants.split(",");
  if (lastDigit === 1) return forms[0];
  if (lastDigit > 1 && lastDigit < 5) return forms[1];
  return forms[2];
}
