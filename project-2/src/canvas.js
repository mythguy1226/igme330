/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import * as main from './main.js';

// Canvas fields
let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;

// Electrical Wave Fields
let x = 0;
let y = 0;
let angle = 0;

// Middle Wave Fields
let waveX = 80;
let waveY = 0;
let waveAngle = 0;

// FPS
let fps = 30;

// Fields for Perlin noise
const simplex = new SimplexNoise();
let frequency = 2, magnitude = .5;
let t = 0, tIncrease = .1;

// Function that sets up the default canvas
function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:main.gradientColor1},{percent:.5,color:main.gradientColor2},{percent:1,color:main.gradientColor3}]);
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
	
	// Draw background
	ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = .1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();
		
	// Draw background gradient
	if(params.showGradient)
    {
        gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:main.gradientColor1},{percent:.5,color:main.gradientColor2},{percent:1,color:main.gradientColor3}]);
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }
    
    // Show electrical waves
    if(params.showElectric)
    {
        let deltaAngle = main.electricAngle;
        let color = params.electricColor;
        // Save/Restore Loop
        ctx.save();

        // Left Wave
        for(let i = 0; i < audioData.length; i++)
        {
            // Increase needed values to get the electrical effect
            y += 10;
            if(deltaAngle == 0)
            {
                angle += 0;
            }
            else if(deltaAngle == 0.1)
            {
                angle += 0.1;
            }
            else if(deltaAngle == 0.2)
            {
                angle += 0.2;
            }
            else if(deltaAngle == 0.3)
            {
                angle += 0.3;
            }
            else if(deltaAngle == 0.4)
            {
                angle += 0.4;
            }
            else if(deltaAngle == 0.5)
            {
                angle += 0.5;
            }
            else if(deltaAngle == 0.6)
            {
                angle += 0.6;
            }
            else if(deltaAngle == 0.7)
            {
                angle += 0.7;
            }
            else if(deltaAngle == 0.8)
            {
                angle += 0.8;
            }
            else if(deltaAngle == 0.9)
            {
                angle += 0.9;
            }
            else if(deltaAngle == 1)
            {
                angle += 1;
            }
            x = 100 + (Math.cos(angle) * (audioData[i] / 5));
            drawCircle(ctx,x,y,4,color);

            // Restart trig loop
            if(y > canvasWidth)
            {
                y = 0;
            }
        }
        ctx.restore(); // End Loop

        // Save/Restore Loop
        ctx.save();

        // Right Wave
        for(let i = 0; i < audioData.length; i++)
        {
            // Increase needed values to get the electrical effect
            y += 10;
            if(deltaAngle == 0)
            {
                angle += 0;
            }
            else if(deltaAngle == 0.1)
            {
                angle += 0.1;
            }
            else if(deltaAngle == 0.2)
            {
                angle += 0.2;
            }
            else if(deltaAngle == 0.3)
            {
                angle += 0.3;
            }
            else if(deltaAngle == 0.4)
            {
                angle += 0.4;
            }
            else if(deltaAngle == 0.5)
            {
                angle += 0.5;
            }
            else if(deltaAngle == 0.6)
            {
                angle += 0.6;
            }
            else if(deltaAngle == 0.7)
            {
                angle += 0.7;
            }
            else if(deltaAngle == 0.8)
            {
                angle += 0.8;
            }
            else if(deltaAngle == 0.9)
            {
                angle += 0.9;
            }
            else if(deltaAngle == 1)
            {
                angle += 1;
            }
            x = 700 + (Math.cos(angle) * (audioData[i] / 5));
            drawCircle(ctx,x,y,4,color);

            // Restart trig loop
            if(y > canvasWidth)
            {
                y = 0;
            }
        }
        ctx.restore(); // End Loop
    }

	// Draw bars in radial manner
	if(params.showBars)
    {
        let topSpacing = 75;

        ctx.save();
        ctx.strokeStyle = params.barColor;
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

	// Draw Center Circles
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
            ctx.fillStyle = utils.makeColor(hexaToDecimal(params.circleColor1[1] + params.circleColor1[2]), hexaToDecimal(params.circleColor1[3] + params.circleColor1[4]), hexaToDecimal(params.circleColor1[5] + params.circleColor1[6]), .34 - percent/3.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(hexaToDecimal(params.circleColor2[1] + params.circleColor2[2]), hexaToDecimal(params.circleColor2[3] + params.circleColor2[4]), hexaToDecimal(params.circleColor2[5] + params.circleColor2[6]), .10 - percent/10.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(hexaToDecimal(params.circleColor3[1] + params.circleColor3[2]), hexaToDecimal(params.circleColor3[3] + params.circleColor3[4]), hexaToDecimal(params.circleColor3[5] + params.circleColor3[6]), .5 - percent/5.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
        ctx.restore();
    }

    // Function that converts hexadecimal string values to decimal values for rgba()
    function hexaToDecimal(string){
        // Parse the string
        return parseInt(string, 16);
    }

    // Draw the wave in the center surrounding the circle
    if(params.showWaves)
    {
        // Save/Restore Loop
        ctx.save();
        for(let i = 0; i < audioData.length; i++)
        {
            // Increase values as needed
            // Utiize different trig functions for different effects
            waveX += 1;
            waveAngle += 0.2;
            if(params.waveStyle == "Atan")
            {
                waveY = canvasWidth/2 + (Math.atan(waveAngle) * (audioData[i]/2));
            }
            else if(params.waveStyle == "Sin")
            {
                waveY = canvasWidth/2 + (Math.sin(waveAngle) * (audioData[i]/2));
            }
            else if(params.waveStyle == "Cos")
            {
                waveY = canvasWidth/2 + (Math.cos(waveAngle) * (audioData[i]/2));
            }
            else if(params.waveStyle == "Tan")
            {
                waveY = canvasWidth/2 + (Math.tan(waveAngle) * (audioData[i]/2));
            }
            ctx.translate(canvasWidth/2, canvasHeight/2);
            ctx.rotate(.5);
            ctx.translate(-canvasWidth/2, -canvasHeight/2);

            drawCircle(ctx,waveX/1.5,waveY/1.5,4,params.waveColor);
            if(waveX > 400)
            {
                waveX = 380;
            }
            
        }
        ctx.restore(); // End Loop
    }

    // Draw Deformed Circle in Center
    if(params.showPerlin)
    {
        drawDeformedCircle(ctx, {x:canvasWidth/2,y:canvasHeight/2,radius:20},frequency,magnitude,t/2, params);
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

// Method that draws a circle
function drawCircle(ctx,x,y,radius,color)
{
    // Save/Restore Loop
    ctx.save();

    // Set Style
    ctx.fillStyle = color;

    // begin Drawing
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI * 2);

    // Close Path/Fill/End Restore Loop
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// Deformed circle for the center of the canvas
function drawDeformedCircle(ctx,circle,frequency,magnitude,t=0, params) 
{
    // Save/Restore Loop
    ctx.save();

    // Set the styling
    ctx.fillStyle = params.blobFill;
    ctx.strokeStyle = params.blobBorder;
    ctx.lineWidth = 4;
    
    // Begin path for drawing
    ctx.beginPath();

    // Sample points evenly around the circle
    const numPoints = Math.floor(4 * circle.radius + 20);
    for (let i = 0; i <= numPoints; i++) {
            const deformedAngle = (2 * Math.PI * i) / numPoints;

            // Figure out the x/y coordinates for the given angle
            const x = Math.cos(deformedAngle);
            const y = Math.sin(deformedAngle);

            // Randomly deform the radius of the circle at this point
            const deformation = simplex.noise3D(x * frequency,
                                                y * frequency,
                                                t) + 1;
            // Change Radius based on Audio Data
            const radius = circle.radius * (1 + magnitude * deformation) + audioData[0]/5;

            // Extend the circle to this deformed radius
            ctx.lineTo(circle.x + radius * x, circle.y + radius * y);
    }
    
    // Close Path/Fill/End Restore Loop
    ctx.closePath()
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

export {setupCanvas,draw};