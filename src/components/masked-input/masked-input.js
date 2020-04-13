document.addEventListener("DOMContentLoaded", () => {
  const maskedInputs = document.querySelectorAll(".js-masked-input");
  maskedInputs.forEach((masked) => MaskedInput(masked));
});

function MaskedInput(node) {
  const maskedInput = document.getElementById(node.id);
  const placeholder = document.getElementById(node.id + "-placeholder");
  const mask = /^\d{2}\.\d{2}\.\d{4}$/;
  const separators = ".,/";
  const maskText = "ДД.ММ.ГГГГ";
  const goodMatch = "13.09.1989";
  let previous = "";

  const separatorRequired = (length) => length === 2 || length === 5;
  const appendSeparator = (input) => input + "."

  maskedInput.addEventListener("input", MaskedInputOnInput);

  function MaskedInputOnInput({ target: t }) {
    // extend input with a good match so we can test against full regexp
    let ok = mask.test(t.value + goodMatch.slice(t.value.length));
    let len = t.value.length; // for brevity, can cause bugs if t.value was changed

    if (!ok) {
      // allow single digit + separator input, e.g. "2." => "02."
      if (
        t.value.slice(-2, -1) !== "0" &&
        separatorRequired(len) &&
        separators.includes(t.value.slice(-1))
      ) {
        t.value = t.value.slice(0, len - 2) + "0" + t.value.slice(len - 2);
        t.value = t.value.slice(0, -1) + ".";
        placeholder.textContent =
          t.value + placeholder.textContent.slice(t.value.length);
      } else {
        t.value = previous;
      }
    } else {
      let diff = previous.length - len; // positive when user deletes something

      if (separatorRequired(len)) {
        if (len > previous.length) {
          t.value = appendSeparator(t.value)
        } else {
          // when separator is deleted, delete a number before it as well
          if (diff === 1 && previous.slice(-1) === ".") {
            t.value = t.value.slice(0, -1);
            previous = previous.slice(0, -2);
          }
          // if a selection like 13_.09_ is deleted, do not delete the separator
          else if (diff > 1 && separatorRequired(len)) {
            t.value = appendSeparator(t.value)
          }
        }
      }
      // update placeholder to match input
      if (diff < 0) {
        placeholder.textContent =
          t.value + placeholder.textContent.slice(t.value.length);
      } else placeholder.textContent = t.value + maskText.slice(t.value.length);
    }
    previous = t.value;
  }
}
