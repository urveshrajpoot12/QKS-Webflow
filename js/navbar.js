const dropdown = document.querySelector(".enterprise-dropdown");
const menu = document.querySelector(".enterprise-menu");

dropdown.addEventListener("mouseenter", () => {
  menu.classList.add("active");
});

dropdown.addEventListener("mouseleave", () => {
  setTimeout(() => {
    if (!menu.matches(":hover")) {
      menu.classList.remove("active");
    }
  }, 100);
});

menu.addEventListener("mouseenter", () => {
  menu.classList.add("active");
});

menu.addEventListener("mouseleave", () => {
  menu.classList.remove("active");
});