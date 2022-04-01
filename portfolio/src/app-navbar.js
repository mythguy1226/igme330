// Define a template
const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
  <style>
    :host{
        user-select: none;
    }
    a.underline
    {
        position: relative;
    }
    a.underline:before 
    {
        content: "";
        position: absolute;
        width: 0;
        height: 0.2rem;
        margin-bottom: 1.5rem;
        bottom: 0;
        left: 0;
        background-color: #fff;
        visibility: hidden;
        transition: all 0.3s ease-in-out;
    }
    a.underline:hover:before 
    {
        visibility: visible;
        width: 95%;
    }
    .navbar-burger
    {
        background-color: #000;
    }
    .navbar-burger:hover
    {
        background-color: #000;
    }
    span
    {
        color: #fff;
    }
    a:hover, a:hover span 
    {
        color: #00ffff;
    }

    @media only screen and (max-width: 1023px)
    {
        .navbar-menu
        {
            background-color: #000;
        }
        a.underline:hover
        {
            color: #000;
        }
        .navbar-burger
        {
            background-color: #000;
        }
        .navbar-burger:hover
        {
            background-color: #000;
        }
        span
        {
            color: #fff;
        }
        a:hover, a:hover span 
        {
            color: #00ffff;
        }

        a.underline
        {
            position: relative;
            color: #fff;
        }
        a.underline:before 
        {
            content: "";
            position: absolute;
            width: 0;
            height: 0.2rem;
            margin-bottom: 1.5rem;
            bottom: 0;
            left: 0;
            background-color: #fff;
            visibility: hidden;
            transition: all 0.3s ease-in-out;
        }
        a.underline:hover:before 
        {
            visibility: hidden;
            width: 95%;
        }
    }
  </style>
  <nav class="navbar has-shadow is-black">
    <!-- logo / brand -->
    <div class="navbar-brand">
        <a class="navbar-item" href="home.html">
            <img src="images/gameIcon.png" alt="site-logo" style="max-height: 70px" class="py-2 px-2">
        </a>
        <a class="navbar-burger" id="burger">
            <span></span>
            <span></span>
            <span></span>
        </a>
    </div>

    <div class="navbar-menu" id="nav-links">
        <div class="navbar-start">
            <a id="home" class="navbar-item underline" href="home.html">
                Home
            </a>
        
            <a id="gallery" class="navbar-item is-hoverable underline" href="gallery.html">
                Gallery
            </a>
        
            <a id="resume" class="navbar-item is-hoverable underline" href="resume.html">
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