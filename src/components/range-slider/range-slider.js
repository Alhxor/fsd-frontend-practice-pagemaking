document.addEventListener("DOMContentLoaded", () => {
  const rangeSliders = document.querySelectorAll(".range-slider");
  rangeSliders.forEach((rs) => RangeSlider(rs));
});

function RangeSlider(node) {
  const text = node.querySelector(".range-slider__text");
  const slider = node.querySelector(".range-slider__slider");
  const selection = slider.querySelector(".range-slider__selection");
  const selectionStyles = getComputedStyle(selection);
  const start = selection.querySelector(".range-slider__start");
  const end = selection.querySelector(".range-slider__end");
  const { min, max, units } = node.dataset;

  selection.style.left = "40px";
  selection.style.right = "50px";

  let left = parseInt(selectionStyles.left)
  let right = parseInt(selectionStyles.right)
  let width = parseInt(selectionStyles.width)
  // console.log(slider.clientWidth - right - left)

  let moveListener = () => {};
  let oldX = 0;

  const createMoveListener = side => event => {
    if (oldX === 0) oldX = event.x;

    const change = (side === "left") ? event.x - oldX : oldX - event.x
    const current = parseInt(selection.style[side])

    selection.style[side] = current + change + "px"
    oldX = event.x
  }

  const upListener = () => {
    oldX = 0;
    document.removeEventListener("mousemove", moveListener);
    document.removeEventListener("mouseup", upListener)
  }

  start.addEventListener("mousedown", () => {
    moveListener = createMoveListener("left")

    document.addEventListener("mousemove", moveListener);
    document.addEventListener("mouseup", upListener)
  });

  end.addEventListener("mousedown", () => {
    moveListener = createMoveListener("right")

    document.addEventListener("mousemove", moveListener);
    document.addEventListener("mouseup", upListener)
  })
}
