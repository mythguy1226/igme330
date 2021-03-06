// Define a template
const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Akshar:wght@300&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Cantarell:ital@1&display=swap');
    :host{
        user-select: none;
    }
    a
    {
        font-family: 'Cantarell', sans-serif;
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
        visibility: visible;
        width: 95%;
    }
    .navbar-burger
    {
        background-color: #0066ff;
    }
    .navbar-burger:hover
    {
        background-color: #0066ff;
    }
    span
    {
        color: #fff;
    }
    a:hover, a:hover span 
    {
        color: #00ffff;
    }
    #nav
    {
        background-color: #0066ff;
        color: #fff;
        font-family: 'Cantarell', sans-serif;
    }
    #nav-links
    {
        background-color: #0066ff;
        color: #fff;
    }

    .navbar-start a:hover
    {
        background-color: #0066ff;
        color: #fff;
    }

    @media only screen and (max-width: 1023px)
    {
        #nav
        {
            color: #0066ff;
        }
        #nav-links
        {
            background-color: #0066ff;
        }
        a.underline:hover
        {
            color: #000;
        }
        .navbar-burger
        {
            background-color: #0066ff;
        }
        .navbar-burger:hover
        {
            background-color: #0066ff;
        }
        span
        {
            color: #fff;
        }
        a:hover, a:hover span 
        {
            color: #000;
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

        .navbar-start a:hover
        {
            background-color: #fff;
            color: #000;
        }
    }
  </style>
  <nav id="nav" class="navbar has-shadow">
    <!-- logo / brand -->
    <div class="navbar-brand">
        <a class="navbar-item" href="home.html">
            <img src="media/audio.png" alt="site-logo" style="max-height: 70px" class="py-2 px-2">
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
        
            <a id="app" class="navbar-item is-hoverable underline" href="app.html">
                App
            </a>
        
            <a id="documentation" class="navbar-item is-hoverable underline" href="documentation.html">
                Documentation
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
            case "app": 
            this.shadowRoot.querySelector("#app").style.fontWeight = "bold";
                break;
            case "documentation": 
            this.shadowRoot.querySelector("#documentation").style.fontWeight = "bold";
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