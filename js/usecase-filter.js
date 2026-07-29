console.log("QKS Filter Loaded");

const cards = document.querySelectorAll(".usecase-card");
const objectiveBtns = document.querySelectorAll(".objective-buttons .filter-button");

let activeObjective = "";

objectiveBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();

    // active class
    objectiveBtns.forEach((b) => b.classList.remove("active"));
    this.classList.add("active");

    activeObjective = this.innerText.trim();

    cards.forEach((card) => {
      const objectives = (card.dataset.objectives || "").toLowerCase();

      if (
        objectives.includes(activeObjective.toLowerCase())
      ) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
});
console.log("Cards Found:", cards.length);

objectiveBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {

    e.preventDefault();

    console.log("Clicked:", this.innerText.trim());

    objectiveBtns.forEach((b) => b.classList.remove("active"));
    this.classList.add("active");

    const activeObjective = this.innerText.trim();

    cards.forEach((card, index) => {

      console.log(
        "Card",
        index + 1,
        card.dataset.objectives
      );

      const objectives = (card.dataset.objectives || "").toLowerCase();

      if (objectives.includes(activeObjective.toLowerCase())) {
        console.log("MATCH");
        card.style.display = "";
      } else {
        console.log("HIDE");
        card.style.display = "none";
      }

    });

  });
});