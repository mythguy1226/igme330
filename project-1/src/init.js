// Imports
import "./marvel-footer.js";
import "./marvel-header.js";

// Mobile Menu
const burgerIcon = document.querySelector("#burger");
const navBarMenu = document.querySelector("#nav-links");

// Toggle dropdown menu
burgerIcon.addEventListener('click', () => {
    navBarMenu.classList.toggle('is-active');
});