console.log("Navbar Loaded");const dropdown = document.querySelector(".enterprise-dropdown");
const menu = document.querySelector(".enterprise-menu");

dropdown.addEventListener("mouseenter",()=>{

    menu.classList.add("active");

});

dropdown.addEventListener("mouseleave",()=>{

    menu.classList.remove("active");

});

menu.addEventListener("mouseenter",()=>{

    menu.classList.add("active");

});

menu.addEventListener("mouseleave",()=>{

    menu.classList.remove("active");

});