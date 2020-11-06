document.addEventListener("DOMContentLoaded", () => {
  const rateButtons = document.querySelectorAll(".rate-button");
  rateButtons.forEach((btn) => RateButton(btn));
});

function RateButton(node) {
  const stars = [...node.querySelectorAll(".rate-button__star")];
  const icons = node.querySelectorAll(".rate-button__star .material-icons");
  const full = "rate-button__star--full";
  let rating = stars.reduce(
    (filled, star) => filled + [...star.classList].includes(full),
    0
  );

  stars.forEach((star, indClicked) => {
    star.addEventListener("click", () => {
      rating = indClicked + 1

      stars.forEach((star, i) => {
        if (indClicked >= i) {
          star.classList.add(full);
          icons[i].textContent = "star";
        } else {
          star.classList.remove(full);
          icons[i].textContent = "star_border";
        }
      });
    });
  });
}
