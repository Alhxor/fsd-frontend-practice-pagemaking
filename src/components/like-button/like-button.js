document.addEventListener("DOMContentLoaded", () => {
  const likeButtons = document.querySelectorAll(".like-button");
  likeButtons.forEach((btn) => LikeButton(btn));
});

function LikeButton(node) {
  const counter = node.querySelector(".like-button__counter");
  const icon = node.querySelector(".like-button__icon .material-icons");
  let clicked = [...node.classList].includes("like-button--clicked");

  const clickListener = () => {
    let likes = parseInt(counter.textContent);

    if (!clicked) {
      counter.textContent = likes + 1;
      icon.textContent = "favorite";
    } else {
      counter.textContent = likes - 1;
      icon.textContent = "favorite_border";
    }

    node.classList.toggle("like-button--clicked")
    clicked = !clicked
  };

  node.addEventListener("click", clickListener);
}
