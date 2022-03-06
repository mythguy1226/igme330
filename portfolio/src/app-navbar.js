// Define a template
const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
  <style>
    :host{
        user-select: none;
    }
  </style>
  <nav class="navbar has-shadow is-white">
    <!-- logo / brand -->
    <div class="navbar-brand">
        <a class="navbar-item" href="home.html">
            <img src="images/gameIcon.jpg" alt="site-logo" style="max-height: 70px" class="py-2 px-2">
        </a>
        <a class="navbar-burger" id="burger">
            <span></span>
            <span></span>
            <span></span>
        </a>
    </div>

    <div class="navbar-menu" id="nav-links">
        <div class="navbar-start">
            <a id="home" class="navbar-item" href="home.html">
                Home
            </a>
        
            <a id="gallery" class="navbar-item is-hoverable" href="gallery.html">
                Gallery
            </a>
        
            <a id="resume" class="navbar-item is-hoverable" href="resume.html">
                Resume
            </a>
        </div>
    </div>
</nav>
`;

// Class for AppHeader Component
class AppNavbar extends HTMLElement
{
    // Constructor
    constructor()
    {
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    // Event handler method
    connectedCallback()
    {
        // Mobile Menu
        const burgerIcon = this.shadowRoot.querySelector("#burger");
        const navBarMenu = this.shadowRoot.querySelector("#nav-links");

        // Toggle dropdown menu
        burgerIcon.addEventListener('click', () => {
            navBarMenu.classList.toggle('is-active');
        });

        // Render element
        this.render();
    }

    // Method for rendering content on the screen
    render()
    {
        // Get the page attribute
        const page = this.dataset.page ? this.dataset.page : "None";

        // Based on data-page bold the corresponding link in the nav
        switch(page)
        {
            case "home": 
                this.shadowRoot.querySelector("#home").style.fontWeight = "bold";
                break;
            case "gallery": 
            this.shadowRoot.querySelector("#gallery").style.fontWeight = "bold";
                break;
            case "resume": 
            this.shadowRoot.querySelector("#resume").style.fontWeight = "bold";
                break;
        }
    }

    // Method for handling attribute changes
    attributeChangedCallback(attributeName, oldVal, newVal)
    {
        //console.log(attributeName,oldVal,newVal);
        this.render();
    }

    // Watches attribute changes and returns them
    static get observedAttributes()
    {
        return ["data-page"];
    }
} 

// Define the element
customElements.define('app-navbar', AppNavbar);