/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;
let x = 0;
let y = 0;
let angle = 0;

let waveX = 80;
let waveY = 0;
let waveAngle = 0;

let fps = 30;

const simplex = new SimplexNoise();
let radius = 50, pointSize = 2, numPoints = 20;
let frequency = 2, magnitude = .5;
let t = 0, tIncrease = .1;
let randomMagnitude = 4;
let showShape = true;


function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"blue"},{percent:.25,color:"#330000"},{percent:.5,color:"#666600"},{percent:.75,color:"#660066"},{percent:1,color:"#006600"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);
}

function draw(params={}){
    // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// 2 - draw background
	ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = .1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();
		
	// 3 - draw gradient
	if(params.showGradient)
    {
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }
    
    // Show electrical waves
    if(params.showWaves)
    {
        drawWaves();
    }

	// 4 - draw bars
	if(params.showBars)
    {
        let topSpacing = 75;

        ctx.save();
        ctx.strokeStyle = `rgba(255,255,255,0.50)`;
        ctx.lineWidth = 5;
        let offset = 5;
        // loop through data and draw
        for(let i = 0; i < audioData.length; i++)
        {
            ctx.beginPath();
            ctx.moveTo((canvasWidth/2) + topSpacing, (canvasHeight/2) + topSpacing);
            ctx.lineTo((canvasWidth/2) + audioData[i]/4 + topSpacing, (canvasHeight/2) + audioData[i]/4 + topSpacing);
            ctx.lineTo((canvasWidth/2) + audioData[i]/4 + topSpacing + offset, (canvasHeight/2) + audioData[i]/4 + topSpacing + offset);
            ctx.translate(canvasWidth/2, canvasHeight/2);
            ctx.rotate(.1);
            ctx.translate(-canvasWidth/2, -canvasHeight/2);
            ctx.stroke();
        }
        ctx.restore();
    }
	// 5 - draw circles
    if(params.showCircles)
    {
        let maxRadius = canvasHeight/4;
        ctx.save();
        ctx.globalAlpha = 0.5;
        for(let i = 0; i < audioData.length; i++)
        {
            let percent = audioData[i] / 255;

            let circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(255, 111, 111, .34 - percent/3.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 0, 255, .10 - percent/10.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(200, 200, 0, .5 - percent/5.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
        ctx.restore();
    }

    if(params.showWaves)
    {
        ctx.save();
        for(let i = 0; i < audioData.length; i++)
        {
            waveX += 1;
            waveAngle += 0.2;
            waveY = canvasWidth/2 + (Math.atan(waveAngle) * (audioData[i]/2));
            ctx.translate(canvasWidth/2, canvasHeight/2);
            ctx.rotate(.5);
            ctx.translate(-canvasWidth/2, -canvasHeight/2);

            drawCircle(ctx,waveX/1.5,waveY/1.5,4,`#00ffff`);
            if(waveX > 400)
            {
                waveX = 380;
            }
            
        }
        ctx.restore();
    }
    if(params.showPerlin)
    {
        drawDeformedCircle(ctx, {x:canvasWidth/2,y:canvasHeight/2,radius:20},frequency,magnitude,t/2);
        t+=tIncrease;
    }
    
    // 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
	let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;

	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for(let i = 0; i < length; i+=4)
    {
		// C) randomly change every 20th pixel to red
        if(params.showNoise && Math.random() < 0.05) // Noise
        {
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			// zero out the red and green and blue channels
			// make the red channel 100% red
            data[i] = data[i+1] = data[i+2] = 0;
            data[i + 1] = 255;
        }// end if

        if(params.showInvert) // Invert filter
        {
            let red = data[i], green = data[i+1], blue = data[i+2];
            data[i] = 255 - red;
            data[i+1] = 255 - green;
            data[i+1] = 255 - blue;
        }
    }// end for

    if(params.showEmboss) // Emboss filter
    {
        for(let i = 0; i < length; i++)
        {
            if(i%4 == 3) continue; // skip alpha channel
            data[i] = 127 + 2*data[i] - data[i+4] - data[i + width * 4]
        }
    }

    // D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
		
}

function drawCircle(ctx,x,y,radius,color)
{
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawWaves()
{
    ctx.save();
    for(let i = 0; i < audioData.length; i++)
    {
        y += 10;
        angle += 0.5;
        x = 100 + (Math.cos(angle) * (audioData[i] / 5));
        drawCircle(ctx,x,y,4,`#00ffff`);
        if(y > canvasWidth)
        {
            y = 0;
        }
    }
    ctx.restore();

    ctx.save();
    for(let i = 0; i < audioData.length; i++)
    {
        y += 10;
        angle += 0.5;
        x = 700 + (Math.cos(angle) * (audioData[i] / 5));
        drawCircle(ctx,x,y,4,`#00ffff`);
        if(y > canvasWidth)
        {
            y = 0;
        }
    }
    ctx.restore();
}

function drawDeformedCircle(ctx,circle,frequency,magnitude,t=0) {
    ctx.save();
    ctx.fillStyle = "#00ffff";
    //ctx.strokeStyle= "gray";
    ctx.lineWidth = 4;
    ctx.beginPath();

    // Sample points evenly around the circle
    const numPoints = Math.floor(4 * circle.radius + 20);
    for (let i = 0; i <= numPoints; i++) {
            const angle = (2 * Math.PI * i) / numPoints;

            // Figure out the x/y coordinates for the given angle
            const x = Math.cos(angle);
            const y = Math.sin(angle);

            // Randomly deform the radius of the circle at this point
            const deformation = simplex.noise3D(x * frequency,
                                                y * frequency,
                                                t) + 1;
            const radius = circle.radius * (1 + magnitude * deformation) + audioData[0]/5;
            // Extend the circle to this deformed radius
            ctx.lineTo(circle.x + radius * x, circle.y + radius * y);
    }
    
    ctx.closePath()
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

export {setupCanvas,draw};