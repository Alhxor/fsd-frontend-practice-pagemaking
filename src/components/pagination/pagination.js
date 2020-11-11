document.addEventListener("DOMContentLoaded", () => {
  const Paginations = document.querySelectorAll(".pagination");
  Paginations.forEach((pagination) => Pagination(pagination));
});


function Pagination(node) {
  const total = parseInt(node.dataset.total);
  const linksNode = node.querySelector(".pagination__links");
  const links = linksNode.querySelectorAll(".pagination__link");
  const arrow = linksNode.lastChild
  let current = parseInt(
    node.querySelector(".pagination__link--current").textContent
  );

  /**
   * This is REALLY BAD and IT DOESN'T WORK
   * maybe create 2 extra links in template and use 'cells' 1-8
   * instead of trying to create it all anew
   */
  links.forEach((link) =>
    link.addEventListener("click", function clickListener() {
      let classes = [...link.classList];
      if (
        classes.includes("pagination__link--inactive") ||
        classes.includes("pagination__link--current")
      )
        return;

      if (classes.includes("pagination__link--forward"))
        console.log("going to the next page");

      let newCurrent = parseInt(link.textContent)
      let newLinks = document.createElement("div")
      newLinks.classList.add("pagination__links")
      const first = createLink("1")
      const ellipsis = createLink("...", "inactive")
      const last = createLink(total)

      newLinks.appendChild(first)

      if (newCurrent < 3) {
        newLinks.appendChild(createLink("2"))
        newLinks.appendChild(createLink("3"))
        newLinks.appendChild(ellipsis)
        newLinks.appendChild(last)
        newLinks.appendChild(arrow)
      } else if (newCurrent === 3) {
        newLinks.appendChild(createLink("2"))
        newLinks.appendChild(createLink("3"))
        newLinks.appendChild(createLink("4"))
        newLinks.appendChild(ellipsis)
        newLinks.appendChild(last)
        newLinks.appendChild(arrow)
      } else if (newCurrent === total - 2) {
        newLinks.appendChild(ellipsis)
        newLinks.appendChild(createLink(total - 3))
        newLinks.appendChild(createLink(total - 2))
        newLinks.appendChild(createLink(total - 1))
        newLinks.appendChild(last)
        newLinks.appendChild(arrow)
      } else if (newCurrent > total - 2) {
        newLinks.appendChild(ellipsis)
        newLinks.appendChild(createLink(total - 2))
        newLinks.appendChild(createLink(total - 1))
        newLinks.appendChild(last)
        newLinks.appendChild(arrow)
      } else {
        newLinks.appendChild(ellipsis)
        newLinks.appendChild(createLink(newCurrent - 1))
        newLinks.appendChild(createLink(newCurrent))
        newLinks.appendChild(createLink(newCurrent + 1))
        newLinks.appendChild(ellipsis)
        newLinks.appendChild(last)
        newLinks.appendChild(arrow)
      }

      [...newLinks.children].forEach(c => c.addEventListener("click", clickListener))
      linksNode.replaceWith(newLinks)
      // console.log(link.textContent)
    })
  );
}

function createLink(text, modifier) {
  let newLink = document.createElement("div")
  newLink.classList.add("pagination__link")
  newLink.textContent = text

  if (modifier)
    newLink.classList.add("pagination__link--" + modifier)

  return newLink
}
