document.addEventListener("DOMContentLoaded", () => {
  const rangeSliders = document.querySelectorAll(".range-slider");
  rangeSliders.forEach((rs) => RangeSlider(rs));
});

function RangeSlider(node) {
  const text = node.querySelector(".range-slider__text");
  const slider = node.querySelector(".range-slider__slider");
  const selection = slider.querySelector(".range-slider__selection");
  const start = selection.querySelector(".range-slider__start");
  const end = selection.querySelector(".range-slider__end");
  const { min, max, units } = node.dataset;

  selection.style.left = "65px";
  selection.style.right = "132px";

  const spacifyNumber = (n) => {
    if (n > 999 && n < 1000000) {
      let str = String(n)
      return `${str.substr(0, str.length - 3)} ${str.substr(-3)}`
    }
    return n
  };

  const updateText = () => {
    let distanceFromLeft = (
      parseInt(selection.style.left) / slider.clientWidth
    ).toFixed(2);
    let distanceFromRight = (
      parseInt(selection.style.right) / slider.clientWidth
    ).toFixed(2);

    let unitsLeft = Math.trunc(parseInt(min) + max * distanceFromLeft);
    let unitsRight = Math.trunc(max - max * distanceFromRight);

    text.textContent = `${spacifyNumber(unitsLeft)}${units} - ${spacifyNumber(unitsRight)}${units}`;
  };

  updateText();

  let oldX = 0;
  const createMoveListener = (side) => (event) => {
    if (oldX === 0) oldX = event.x;

    const change = side === "left" ? event.x - oldX : oldX - event.x;
    oldX = event.x;
    const current = parseInt(selection.style[side]);
    let result = current + change;

    if (result < 0) result = 0;

    selection.style[side] = result + "px";
    if (selection.clientWidth < 30) selection.style[side] = current + "px";

    updateText();
  };

  const moveListenerLeft = createMoveListener("left");
  const moveListenerRight = createMoveListener("right");

  const addListener = (btn, left = true) => {
    btn.addEventListener("mousedown", () => {
      const moveListener = left ? moveListenerLeft : moveListenerRight;
      const upListener = () => {
        oldX = 0;
        document.removeEventListener("mousemove", moveListener);
        document.removeEventListener("mouseup", upListener);
      };
      document.addEventListener("mousemove", moveListener);
      document.addEventListener("mouseup", upListener);
    });
  };

  addListener(start);
  addListener(end, false);
}
