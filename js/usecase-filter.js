document.addEventListener("DOMContentLoaded", () => {

    // Sabhi cards select karo
    const cards = document.querySelectorAll("[data-card='true']");

    console.log("Total Cards :", cards.length);

    cards.forEach((card, index) => {

        const objectives = card.querySelector("[data-objectives='true']");
        const business = card.querySelector("[data-business='true']");

        console.log("---------------");

        console.log("Card :", index + 1);

        console.log(
            "Objectives :",
            objectives ? objectives.textContent.trim() : "Not Found"
        );

        console.log(
            "Business :",
            business ? business.textContent.trim() : "Not Found"
        );

    });

});