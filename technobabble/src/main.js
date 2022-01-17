"use strict";
        
// Make sure code is ran after page is loaded
window.onload = main;

// Function for main code
function main()
{
    const words1 = ["Acute", "Aft", "Anti-matter", "Bipolar", "Cargo", "Command", "Communication", "Computer", "Deuterium", "Dorsal", "Emergency", "Engineering", "Environmental", "Flight", "Fore", "Guidance", "Heat", "Impulse", "Increased", "Inertial", "Infinite", "Ionizing", "Isolinear", "Lateral", "Linear", "Matter", "Medical", "Navigational", "Optical", "Optimal", "Optional", "Personal", "Personnel", "Phased", "Reduced", "Science", "Ship's", "Shuttlecraft", "Structural", "Subspace", "Transporter", "Ventral"];
    
    const words2 = ["Propulsion", "Dissipation", "Sensor", "Improbability", "Buffer", "Graviton", "Replicator", "Matter", "Anti-matter", "Organic", "Power", "Silicon", "Holographic", "Transient", "Integrity", "Plasma", "Fusion", "Control", "Access", "Auto", "Destruct", "Isolinear", "Transwarp", "Energy", "Medical", "Environmental", "Coil", "Impulse", "Warp", "Phaser", "Operating", "Photon", "Deflector", "Integrity", "Control", "Bridge", "Dampening", "Display", "Beam", "Quantum", "Baseline", "Input"];
    
    const words3 = ["Chamber", "Interface", "Coil", "Polymer", "Biosphere", "Platform", "Thruster", "Deflector", "Replicator", "Tricorder", "Operation", "Array", "Matrix", "Grid", "Sensor", "Mode", "Panel", "Storage", "Conduit", "Pod", "Hatch", "Regulator", "Display", "Inverter", "Spectrum", "Generator", "Cloud", "Field", "Terminal", "Module", "Procedure", "System", "Diagnostic", "Device", "Beam", "Probe", "Bank", "Tie-In", "Facility", "Bay", "Indicator", "Cell"];
    
    // Function for getting random elements from an array
    function getRandomElement(array)
    {
        return array[Math.floor(Math.random() * array.length)]
    }

    // Function for generating new babble text
    function generateText()
    {
        // Get 3 new random words
        let word1 = getRandomElement(words1);
        let word2 = getRandomElement(words2);
        let word3 = getRandomElement(words3);

        // Form the new phrase
        let babblePhrase = word1 + " " + word2 + " " + word3;

        // Change the output HTML text
        document.querySelector("#output").innerHTML = babblePhrase;
    }

    // Generate some initial text
    generateText();

    // Add the event listener to the button for generating new text
    const button = document.querySelector("#myButton");
    button.onclick = generateText;
}