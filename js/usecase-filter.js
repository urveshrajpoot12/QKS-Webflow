console.log("QKS Filter Started");

const cards = document.querySelectorAll(".usecase-card");

const objectiveChecks = document.querySelectorAll(
  ".objective-buttons input[type='checkbox']"
);

const businessChecks = document.querySelectorAll(
  ".filter-business input[type='checkbox'], .business-buttons input[type='checkbox']"
);

function applyFilter() {

  const selectedObjectives = [...objectiveChecks]
    .filter(c => c.checked)
    .map(c => c.value.trim());

  const selectedBusiness = [...businessChecks]
    .filter(c => c.checked)
    .map(c => c.value.trim());

  cards.forEach(card => {

    const objectives = (card.dataset.objectives || "")
      .split(",")
      .map(x => x.trim());

    const business = (card.dataset.business || "").trim();

    const objectiveMatch =
      selectedObjectives.length === 0 ||
      selectedObjectives.some(x => objectives.includes(x));

    const businessMatch =
      selectedBusiness.length === 0 ||
      selectedBusiness.includes(business);

    card.style.display =
      objectiveMatch && businessMatch ? "" : "none";

  });

}

objectiveChecks.forEach(c =>
  c.addEventListener("change", applyFilter)
);

businessChecks.forEach(c =>
  c.addEventListener("change", applyFilter)
);

applyFilter();