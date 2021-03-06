import React, { useEffect, useRef, useState } from 'react';
import { Circle, Image } from 'react-konva';
import { deg2Rad, getDeltas, getDist, rad2Deg, xy2polar } from '../../../../util/circle_utils';
import { hslToRgb, hsv2rgb } from '../../../../util/colorspace_utils';
// import { hslToRgb, hsv2rgb } from '../utils/colorspace-utils';


//this uses the basic formula provided by Cory Forsyth here: https://medium.com/@bantic/hand-coding-a-color-wheel-with-canvas-78256c9d7d43
//but i made it my own by using it to create a canvas image that maps all saturation
//and luminance values of a given hue to a circle :) woohoo
export const SatLumCircle = (props) => {
    const [imageCanvas, setImageCanvas] = useState(null);
    const {rad, xPos, yPos} = props; 
    const hue = props.hue / 360
    const width = 2 * rad;
    const height = 2 * rad;


    const drawCircle = (context) => {
        let image = context.createImageData(width, height);
        let data = image.data;
   

        for (let x = -rad; x < rad; x++) {
            for (let y = -rad; y < rad; y++) {
                    let [r, phi] = xy2polar(x, y);    
                    let rowLength = 2*rad;
                    let adjustedX = x + rad; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
                    let adjustedY = y + rad; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
                    let pixelWidth = 4; // each pixel requires 4 slots in the data array
                    let index = (adjustedX + (adjustedY * rowLength)) * pixelWidth;
                
                if (r < rad) {
                  // skip all (x,y) coordinates that are outside of the circle
                    
                    let lightness = rad2Deg(phi)/360
                    let saturation = (getDist(getDeltas([adjustedX, adjustedY],[rad, rad]))) / rad;
                    let [red, green, blue] = hslToRgb(hue, saturation, lightness)
                    let alpha = 255;
                    
                    data[index] = red;
                    data[index+1] = green;
                    data[index+2] = blue;
                    data[index+3] = alpha;
                } else {
                    data[index] = 0;
                    data[index+1] = 0;
                    data[index+2] = 0;
                    data[index+3] = 0;

                }
                        
            }
            
        }

        context.putImageData(image, 0, 0)


    }

    useEffect(() => {
        const canvas = (document.createElement('canvas'))
        const context = canvas.getContext('2d')
        canvas.height = (2*rad)
        canvas.width = (2*rad)
        drawCircle(context)
      
        

        setImageCanvas(canvas)
    }, [hue])

    return(

        imageCanvas && (
        <>
        <Image 
            offsetX={rad} 
            offsetY={rad} 
            scaleY={-1}
             width={2*rad} 
             height={2*rad} 
             rotation={90}
             x={xPos}
              y={yPos}
               image={imageCanvas}/>
        </>
    )
    )
    


}