document.addEventListener("DOMContentLoaded", () => {
  const rangeSliders = document.querySelectorAll(".range-slider");
  rangeSliders.forEach((rs) => RangeSlider(rs));
});

function RangeSlider(node) {
  const text = node.querySelector(".range-slider__text")
  const slider = node.querySelector(".range-slider__slider")
  const selection = slider.querySelector(".range-slider__selection")
  const start = selection.querySelector(".range-slider__start")
  const end = selection.querySelector(".range-slider__end")
  const { min, max, units } = node.dataset;

  let [from, to] = [5000, 10000]
}
