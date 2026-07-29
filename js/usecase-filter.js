console.log("QKS Filter Loaded");

document.addEventListener("click", function (e) {

    const btn = e.target.closest(".objective-buttons .filter-button");

    if (!btn) return;

    e.preventDefault();

    console.log("Clicked:", btn.innerText);

    const buttons = document.querySelectorAll(".objective-buttons .filter-button");

    buttons.forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    const selected = btn.innerText.trim().toLowerCase();

    document.querySelectorAll(".usecase-card").forEach(card => {

        const wrapper = card.closest(".filter-item");

        const objectives = (card.dataset.objectives || "").toLowerCase();

        if (objectives.includes(selected)) {

            wrapper.style.display = "";

            console.log("SHOW", objectives);

        } else {

            wrapper.style.display = "none";

            console.log("HIDE", objectives);

        }

    });

});