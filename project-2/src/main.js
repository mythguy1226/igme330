/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';
import * as loader from './loader.js';

// Draw parameters object
let drawParams = {
  showGradient : true,
  showBars : true,
  showCircles : true,
  showNoise : false,
  showInvert : false,
  showEmboss : false,
  showWaves: true,
  showElectric: true,
  showPerlin: true,
  electricColor: "#00ffff",
  waveColor: "#00ffff",
  waveStyle: "Atan",
  blobFill: "#00ffff",
  blobBorder: "#000000",
  barColor: "rgba(255,255,255,0.50)",
  circleColor1: "#ffffff",
  circleColor2: "#0000ff",
  circleColor3: "#ffff00",
  electricAngle: 0.1,
  gradientColor1: "#000000",
  gradientColor2: "#00ffff",
  gradientColor3: "#0000ff"
}
let electricAngle = 0.1;
let gradientColor1 = "#000000";
let gradientColor2 = "#00ffff";
let gradientColor3 = "#0000ff";

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/Rameses B - Burden of Life.mp3"
});

function init(){
    //drawParams = loader.presets["default"];
    
    //convertJson(loader.presets["default"]);
    audio.setupWebaudio(DEFAULTS.sound1);
    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement,audio.analyserNode);
    loop();
}

function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };

  // Play Button
  const playButton = document.querySelector("#playButton");
  playButton.onclick = e => {
    if(audio.audioCtx.state == "suspended")
    {
        audio.audioCtx.resume();
    }
    if(e.target.dataset.playing == "no")
    {
        audio.playCurrentSound();
        e.target.dataset.playing = "yes";
    }
    else
    {
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no";
    }
  }

  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel = document.querySelector("#volumeLabel");

  volumeSlider.oninput = e => {
      audio.setVolume(e.target.value);
      volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
  };

  volumeSlider.dispatchEvent(new Event("#input"));

  let trackSelect = document.querySelector("#trackSelect");
  trackSelect.onchange = e => {
      audio.loadSoundFile(e.target.value);
      if(playButton.dataset.playing == "yes")
      {
        playButton.dispatchEvent(new MouseEvent("click"));
      }
  }

  // Change the preset
  document.querySelector("#presetSelect").onchange = e => {
    drawParams = loader.presets[e.target.value];
    // Set the default values
    document.querySelector("#circles-color1").value = drawParams.circleColor1;
    document.querySelector("#circles-color2").value = drawParams.circleColor2;
    document.querySelector("#circles-color3").value = drawParams.circleColor3;
    document.querySelector("#wave-color").value = drawParams.waveColor;
    document.querySelector("#bars-color").value = drawParams.barColor;
    document.querySelector("#blob-color1").value = drawParams.blobFill;
    document.querySelector("#blob-color2").value = drawParams.blobBorder;
    document.querySelector("#grad-color1").value = drawParams.gradientColor1;
    document.querySelector("#grad-color2").value = drawParams.gradientColor2;
    document.querySelector("#grad-color3").value = drawParams.gradientColor3;
    document.querySelector("#electric-color").value = drawParams.electricColor;
    document.querySelector("#electric-angle").value = drawParams.electricAngle;
    document.querySelector("#show-perlin").checked = drawParams.showPerlin;
    document.querySelector("#wave-style").value = drawParams.waveStyle;
    document.querySelector("#electric-label").innerHTML = drawParams.electricAngle;
  }

  // Checkbox for gradient
  document.querySelector("#gradientCB").onchange = e => {
    drawParams.showGradient = e.target.checked;
  }

  // Checkbox for lines
  document.querySelector("#barsCB").onchange = e => {
    drawParams.showBars = e.target.checked;
  }

  // Checkbox for circles
  document.querySelector("#circlesCB").onchange = e => {
    drawParams.showCircles = e.target.checked;
  }

  // Checkbox for noise
  document.querySelector("#noiseCB").onchange = e => {
    drawParams.showNoise = e.target.checked;
  }

  // Checkbox for invert
  document.querySelector("#invertCB").onchange = e => {
    drawParams.showInvert = e.target.checked;
  }
	
  // Checkbox for emboss
  document.querySelector("#embossCB").onchange = e => {
    drawParams.showEmboss= e.target.checked;
  }

  // Electricity Color
  document.querySelector("#electric-color").onchange = e => {
    drawParams.electricColor = e.target.value;
  }

  // Electricity Angle
  document.querySelector("#electric-angle").oninput = e => {
    electricAngle = e.target.value;
    drawParams.electricAngle = e.target.value;
    document.querySelector("#electric-label").innerHTML = e.target.value;
  };
  document.querySelector("#electric-angle").dispatchEvent(new Event("#input"));

  // Toggle Electricity
  document.querySelector("#electric-enabled").onchange = e => {
    drawParams.showElectric= e.target.checked;
  }

  // Toggle Wave
  document.querySelector("#wave-enabled").onchange = e => {
    drawParams.showWaves= e.target.checked;
  }

  // Wave Color
  document.querySelector("#wave-color").onchange = e => {
    drawParams.waveColor = e.target.value;
  }

  // Wave Style (Trig function)
  document.querySelector("#wave-style").onchange = e => {
    drawParams.waveStyle = e.target.value;
  }

  // Gradient colors
  document.querySelector("#grad-color1").onchange = e => {
    gradientColor1 = e.target.value;
    drawParams.gradientColor1 = e.target.value;
  }
  document.querySelector("#grad-color2").onchange = e => {
    gradientColor2 = e.target.value;
    drawParams.gradientColor2 = e.target.value;
  }
  document.querySelector("#grad-color3").onchange = e => {
    gradientColor3 = e.target.value;
    drawParams.gradientColor3 = e.target.value;
  }

  // Perlin noise colors
  document.querySelector("#blob-color1").onchange = e => {
    drawParams.blobFill = e.target.value;
  }
  document.querySelector("#blob-color2").onchange = e => {
    drawParams.blobBorder = e.target.value;
  }

  // Toggle Perlin noise
  document.querySelector("#show-perlin").onchange = e => {
    drawParams.showPerlin = e.target.checked;
  }

  // Bar color
  document.querySelector("#bars-color").onchange = e => {
    drawParams.barColor = e.target.value;
  }

  // Circle colors
  document.querySelector("#circles-color1").onchange = e => {
    drawParams.circleColor1 = e.target.value;
  }
  document.querySelector("#circles-color2").onchange = e => {
    drawParams.circleColor2 = e.target.value;
  }
  document.querySelector("#circles-color3").onchange = e => {
    drawParams.circleColor3 = e.target.value;
  }

  // Set the default values
  document.querySelector("#circles-color1").value = drawParams.circleColor1;
  document.querySelector("#circles-color2").value = drawParams.circleColor2;
  document.querySelector("#circles-color3").value = drawParams.circleColor3;
  document.querySelector("#wave-color").value = drawParams.waveColor;
  document.querySelector("#bars-color").value = "#ffffff";
  document.querySelector("#blob-color1").value = drawParams.blobFill;
  document.querySelector("#blob-color2").value = drawParams.blobBorder;
  document.querySelector("#grad-color1").value = gradientColor1;
  document.querySelector("#grad-color2").value = gradientColor2;
  document.querySelector("#grad-color3").value = gradientColor3;
  document.querySelector("#electric-color").value = drawParams.electricColor;


} // end setupUI

function loop()
{
    requestAnimationFrame(loop);
    canvas.draw(drawParams);
}

export {init, electricAngle, gradientColor1, gradientColor2, gradientColor3};