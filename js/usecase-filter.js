// console.log("QKS Filter Loaded");

// const cards = document.querySelectorAll(".usecase-card");
// const objectiveBtns = document.querySelectorAll(".objective-buttons .filter-button");
// const businessCheckboxes = document.querySelectorAll(".business-functions .w-checkbox-input");

// let activeObjective = "";
// let selectedBusinesses = [];

// function applyFilters() {

//     cards.forEach(card => {

//         const wrapper = card.closest(".filter-item");

//         const cardObjective = (card.dataset.objectives || "").toLowerCase();

//         const cardBusiness = (card.dataset.business || "").trim();

//         const objectiveMatch =
//             !activeObjective ||
//             cardObjective.includes(activeObjective.toLowerCase());

//         const businessMatch =
//             selectedBusinesses.length === 0 ||
//             selectedBusinesses.includes(cardBusiness);

//         wrapper.style.display =
//             objectiveMatch && businessMatch ? "" : "none";

//     });

// }


// // Objective Buttons

// objectiveBtns.forEach(btn => {

//     btn.addEventListener("click", function(e){

//         e.preventDefault();

//         if(this.classList.contains("active")){

//             this.classList.remove("active");

//             activeObjective="";

//         }else{

//             objectiveBtns.forEach(b=>b.classList.remove("active"));

//             this.classList.add("active");

//             activeObjective=this.innerText.trim();

//         }

//         applyFilters();

//     });

// });


// // Business Function Checkboxes

// businessCheckboxes.forEach(cb=>{

//     cb.addEventListener("change",function(){

//         const business =
//             this.parentElement
//             .querySelector(".filter-label")
//             .textContent
//             .trim();

//         if(this.checked){

//             if(!selectedBusinesses.includes(business))
//                 selectedBusinesses.push(business);

//         }else{

//             selectedBusinesses =
//                 selectedBusinesses.filter(
//                     item=>item!==business
//                 );

//         }

//         applyFilters();

//     });

// });


// applyFilters();

console.log("QKS Filter v2 Loaded");

document.addEventListener("DOMContentLoaded", () => {

  const cards = [...document.querySelectorAll(".usecase-card")];

  const objectiveButtons = [
    ...document.querySelectorAll(".objective-buttons .filter-button")
  ];

  const businessCheckboxes = [
    ...document.querySelectorAll(".business-functions .w-checkbox-input")
  ];

  let activeObjective = "";
  let selectedBusinesses = [];

  // -----------------------------
  // FILTER FUNCTION
  // -----------------------------
  function filterCards() {

    cards.forEach(card => {

      const wrapper = card.closest(".filter-item");

      const objectives = (card.dataset.objectives || "")
        .toLowerCase()
        .split(",")
        .map(i => i.trim());

      const business = (card.dataset.business || "")
        .toLowerCase()
        .trim();

      const objectiveMatch =
        activeObjective === "" ||
        objectives.includes(activeObjective.toLowerCase());

      const businessMatch =
        selectedBusinesses.length === 0 ||
        selectedBusinesses.includes(business);

      wrapper.style.display =
        objectiveMatch && businessMatch
          ? ""
          : "none";

    });

  }

  // -----------------------------
  // OBJECTIVE BUTTONS
  // -----------------------------
  objectiveButtons.forEach(btn => {

    btn.addEventListener("click", e => {

      e.preventDefault();

      const text =
        btn.querySelector(".text-btn")?.textContent.trim()
        || btn.textContent.trim();

      if (btn.classList.contains("active")) {

        btn.classList.remove("active");

        activeObjective = "";

      } else {

        objectiveButtons.forEach(b =>
          b.classList.remove("active")
        );

        btn.classList.add("active");

        activeObjective = text;

      }

      filterCards();

    });

  });

  // -----------------------------
  // BUSINESS CHECKBOX
  // -----------------------------
  businessCheckboxes.forEach(cb => {

    cb.addEventListener("change", () => {

      selectedBusinesses = businessCheckboxes
        .filter(i => i.checked)
        .map(i =>
          i.nextElementSibling.textContent
            .trim()
            .toLowerCase()
        );

      filterCards();

    });

  });

  // -----------------------------
  // INITIAL
  // -----------------------------
  filterCards();

});