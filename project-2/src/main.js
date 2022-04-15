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

// Draw parameters object
const drawParams = {
  showGradient : true,
  showBars : true,
  showCircles : true,
  showNoise : false,
  showInvert : false,
  showEmboss : false,
  showWaves: true,
  showPerlin: true
}

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/Rameses B - Burden of Life.mp3"
});

function init(){
    audio.setupWebaudio(DEFAULTS.sound1);
    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
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

} // end setupUI

function loop()
{
    requestAnimationFrame(loop);
    canvas.draw(drawParams);
}

export {init};