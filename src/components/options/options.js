import { dispatch } from "@/util/events";

document.addEventListener("DOMContentLoaded", () => {
  const optionsComponents = document.querySelectorAll(".options");
  optionsComponents.forEach((optComponent) => Options(optComponent));
});

function Options(node) {
  const dataKey = node.dataset.datakey;
  const detailedOptionText = node.hasAttribute("data-detailed");
  const options = node.querySelectorAll(".option");
  const optionNames = node.querySelectorAll(".option__name");
  const optionValues = node.querySelectorAll(".option__value");
  const [clear, apply] = node.querySelectorAll(".options__control");
  const useControls = Boolean(clear && apply);

  const buildText = () => {
    const values = [...optionValues].map((span) => parseInt(span.textContent));

    if (detailedOptionText) {
      let out = [...optionNames]
        .map((span, i) =>
          values[i] !== 0
            ? `${values[i]} ${getPluralForm(values[i], span.dataset.plural)}`
            : ""
        )
        .filter((opt) => opt !== "");

      if (out.length > 2) out = out.slice(0, 2);
      if (out.length > 0) return out.join(", ") + "...";
      return "";
    }

    const sum = values.reduce((x, y) => x + y);
    return `${sum} ${getPluralForm(sum, node.dataset.plural)}`;
  };

  const updateListener = () => {
    const text = buildText();
    dispatch(dataKey + "/updateText", { text });
  };

  const applyListener = () => {
    updateListener();
    dispatch(dataKey + "/close");
    clear.classList.remove("invisible");
  };

  const clearListener = () => {
    dispatch(dataKey + "/updateText");
    optionValues.forEach((span) => (span.textContent = 0));
    clear.classList.add("invisible");
  };

  if (useControls) {
    apply.addEventListener("click", applyListener);
    clear.addEventListener("click", clearListener);
  }

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

    if (!useControls) {
      decrement.addEventListener("click", updateListener);
      increment.addEventListener("click", updateListener);
    }
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
