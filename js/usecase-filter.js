console.log("QKS Filter Loaded");

const cards = document.querySelectorAll(".usecase-card");
const objectiveBtns = document.querySelectorAll(".objective-buttons .filter-button");

objectiveBtns.forEach((btn) => {

    btn.addEventListener("click", function (e) {

        e.preventDefault();

        // Active Button
        objectiveBtns.forEach(b => b.classList.remove("active"));
        this.classList.add("active");

        const selectedObjective = this.innerText.trim().toLowerCase();

        console.log("Selected:", selectedObjective);

        cards.forEach(card => {

            const objectives = (card.dataset.objectives || "").toLowerCase();

            const wrapper = card.closest(".filter-item");

            console.log(card.dataset.objectives);

            if (objectives.includes(selectedObjective)) {

                wrapper.style.display = "";

                console.log("SHOW");

            } else {

                wrapper.style.display = "none";

                console.log("HIDE");

            }

        });

    });

});