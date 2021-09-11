import React, { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { Stage, Layer, Circle, Text, Rect, } from "react-konva";
import {Html} from "react-konva-utils"
import { Button, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';

import { dummyHarmonyObj, getAngle, getCirclePoint, getComplement, getDeltas, getDist, getHarmonies, getHarmonyObj } from "../../../util/circle_utils";
import { getDefaultShades, getOneShadeColor, getAngleFromLightness, getDistFromSat, getLightnessFromAngle, getSatFromDist } from "../../../util/shade_utils";


import { SatLumCircle } from './graphics/sat_lum_circle';
import { RainbowFill } from './graphics/rainbow_fill';
import { useHistory } from 'react-router';

//actions and reducers for harmonies useReducer hook
const HARMONY_ACTIONS = {
    UPDATE_ALL_HARMONIES: 'UPDATE_ALL_HARMONIES',
    UPDATE_HARMONY: 'UPDATE_HARMONY',
    GET_HARMONIES: 'GET_HARMONIES',
    ADD_HARMONY: 'ADD_HARMONY'
}

function harmoniesReducer(state, action) {
    let newState;
    switch(action.type) {
        case HARMONY_ACTIONS.UPDATE_ALL_HARMONIES:
            let {numHarmonies, angle, dist, centerXY} = action;
            newState = getHarmonies(numHarmonies, angle, dist, centerXY);
            return newState;
        case HARMONY_ACTIONS.UPDATE_HARMONY:
            const pointXY = [action.x, action.y];
            const ix = action.ix;
            const harmDeltas = getDeltas(pointXY, action.centerXY)
            const harmDist = getDist(harmDeltas)
            const harmAngle = getAngle(harmDeltas)
            const newHarm = getHarmonyObj(ix, harmAngle, action.centerXY)
            newState = Object.assign({}, state, {[ix]:  newHarm})
            return newState;
        case HARMONY_ACTIONS.ADD_HARMONY:
            newState = Object.assign({}, state)
            newState[action.key]= dummyHarmonyObj(action.key, action.centerXY)
            return newState;
            
        case HARMONY_ACTIONS.GET_HARMONIES:
            return state
        default:
            return state
    }
}

//actions and reducer function for shades useReducer hook
const SHD_ACTIONS = {
    UPDATE_ALL_SHADES: 'UPDATE_ALL_SHADES',
    UPDATE_SHADE: 'UPDATE_SHADE',
}

function shadeReducer(state, action) {
    Object.freeze(state)
    let newState = Object.assign({}, state)
    const pointXY = [action.x, action.y];
    const ix = action.ix;
    const shadeDeltas = getDeltas(pointXY, action.centerXY)
    const shadeDist = getDist(shadeDeltas)
    const shadeAngle = getAngle(shadeDeltas)
    const shadeSat = getSatFromDist(shadeDist, action.radius)
    const shadeLight = getLightnessFromAngle(shadeAngle)
   switch(action.type) {
    case SHD_ACTIONS.UPDATE_SHADE:
        newState[ix].l = shadeLight
        newState[ix].s = shadeSat
        return newState;
    case SHD_ACTIONS.UPDATE_ALL_SHADES:
        const lightValChange = shadeLight - state[ix].l
        const satValChange = shadeSat - state[ix].s
        let ang, distance, posXY
        for (let ix = 0; ix < Object.values(state).length; ix++) {
            newState[ix].l += lightValChange;
            newState[ix].s += satValChange;
            if (newState[ix].l > 100) {
                newState[ix].l %= 100;
            } else if (newState[ix].l < 0) {
                newState[ix].l += 100
            } 
            ang = getAngleFromLightness(newState[ix].l, action.radius)
            distance = getDistFromSat(newState[ix].s, action.radius)
            posXY = getCirclePoint(ang, distance, action.centerXY)
            newState[ix].x = posXY[0]
            newState[ix].y = posXY[1]
            newState[ix].angle = ang
            newState[ix].distance = distance
        }
        return newState;
    default:
        return state;
   }
}

//react component
const PaletteWheel = (props) => {

    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const history = useHistory();
    const [radius, setRadius] =  useState(Math.round(windowWidth/3));
    const [satLumRadius, setSatLumRadius] = useState(Math.round(radius/3))
    const [centerXY, setCenterXY] = useState([Math.round(windowWidth * (5/24)), Math.round(windowHeight/2)])
    
    const [angle, setAngle] = useState(0)
    const [dist, setDist] = useState(Math.round(radius/2))
    const [numHarmonies, setNumHarmonies] = useState(2)
    const [toggleComplement, setToggleComplement] = useState(false)
    
    const [handleCenter, setHandleCenter] = useState(getCirclePoint(0, dist, centerXY))
    const [toggleHarmonies, setToggleHarmonies] = useState(false)
    const [toggleShades, setToggleShades] = useState(false)
    const [focusHue, setFocusHue] = useState(angle)

    //reducer variables
    
    const initStateShades = getDefaultShades(satLumRadius, centerXY)
    const [shades, shadeDispatch] = useReducer(shadeReducer, initStateShades) 
    
    //state variables requiring initalizatin  of the reducers because we added a whole new thing to handle it cuz we're cute :)    
    const [complement, setComplement] = useState(getComplement(numHarmonies, angle, dist, centerXY))
    
    const initStateHarms = getHarmonies(numHarmonies, angle, dist, centerXY )
    const [harmonies, dispatch] = useReducer(harmoniesReducer, initStateHarms)

    //refs
    const harmoniesRef = useRef({});
    const shadesRef = useRef({})
    const handlerCircle = useRef(null)
    const stage = useRef(null)
 
   
    //reducer actions
    //we store some of the values we need for mathematical calculations and color calculations as regular
    //degular state variables. but there's some more complex calculations we want to keep out of the useEffect 
    //hook to keep it cleaner, and the values of which we want to access in an iterable and organized way.
    //with useReducer we are able to keep all of the calculations in one place and store information as a
    //json
    const updateAllHarmonies = () => {  //calculate all harmonies of chosen color based on classical color theory relationships
            dispatch({
               type: HARMONY_ACTIONS.UPDATE_ALL_HARMONIES,
               numHarmonies, 
               angle,
               dist,
               centerXY
           })
    }

    const updateHarm = (ix) => {    //update one Harmony for custom made
        const harm = harmoniesRef.current[ix]
        if (harm){ //cuz we set harmRef initially to null / empty object
            dispatch({
                            type: HARMONY_ACTIONS.UPDATE_HARMONY,
                            x: harm.attrs.x,
                            y: harm.attrs.y,
                            ix: ix,
                            centerXY: centerXY,
                            radius: radius
            })
        }
    }    

    const updateShade = (ix) => {   //update one shade for individual manipulation
        const shade = shadesRef.current[ix]
        if (shade){ //see above
            shadeDispatch({
                            type: SHD_ACTIONS.UPDATE_SHADE,
                            x: shade.attrs.x,
                            y: shade.attrs.y,
                            ix: ix,
                            centerXY: centerXY,
                            radius: satLumRadius
            })
        }
    }
    
    const updateAllShades = (ix) => {   //update all shades in the same manner as the currently selected one
        const shade = shadesRef.current[ix]
        if (shade) {
            shadeDispatch({
                type: SHD_ACTIONS.UPDATE_ALL_SHADES,
                x: shade.attrs.x,
                y: shade.attrs.y,
                ix: ix,
                centerXY: centerXY,
                radius: satLumRadius
            })
        }
    }


    const addHarm = (i) => {    //create a placeholder for handling when we are moving from 3 to 4 
        dispatch(
            {type: HARMONY_ACTIONS.ADD_HARMONY, 
            key: i,    
            centerXY
                })
    }


    //event methods: mouse drag
    const handlerDrag = () => {

        if (handlerCircle.current) {
            setHandleCenter([handlerCircle.current.attrs.x, handlerCircle.current.attrs.y]) // update it for our other calculations which use it
            const deltas = getDeltas(handleCenter, centerXY)
            setAngle(getAngle(deltas))
            setDist(getDist(deltas))
            setComplement(getComplement(numHarmonies, angle, dist, centerXY))   

            setFocusHue(angle)            
        }
    }

     //helper methods for keeping handler drag within circle
     const bindHandlerDrag = (pos) => {
        const x = centerXY[0]
        const y = centerXY[1]
        const deltas = getDeltas([pos.x, pos.y], [x,y])
        const distance = getDist(deltas)
        const scale = (radius/2) / distance
        const scale2 =  ((radius * 2/3)/2) / distance
        
       
        
        if (scale < 1) {  //is the radius / new dist < 1 --> outside circle
                return {
                    y: Math.round((pos.y - y) * scale + y),
                    x: Math.round((pos.x - x) * scale + x),
                };
            
        } else {
            if (scale2 < 1) {         //is the 2ndradius / dist < 1 --> outside second circle
                return pos;
            } else {
                return {
                    y: Math.round((pos.y - y) * scale2 + y),
                    x: Math.round((pos.x - x) * scale2 + x),
                }
            }
        }
      }

    const bindShadeHandlerDrag = (pos) => {
        const x = centerXY[0]
        const y = centerXY[1]
        const deltas = getDeltas([pos.x, pos.y], [x,y])
        const distance = getDist(deltas)
        const scale = (satLumRadius) / distance

        if (scale < 1) {    //see above
            return {
                y: Math.round((pos.y - y) * scale + y),
                x: Math.round((pos.x - x) * scale + x),
            };
        
        } else {
            return pos
        }

    }

    

    //event methods for inputs
    const handleHarmoniesInput = (e) => {
        setNumHarmonies(e.target.value)
        if (toggleHarmonies && Object.values(harmonies).length < numHarmonies) {
            addHarm(Object.values(harmonies).length - 1)
        }
    }

    const handleToggleHarmoniesInput = (e) => {
        setToggleHarmonies(e.target.value)
        setFocusHue(angle)
    }

    const handleToggleComplementInput = (e) => {
        setToggleComplement(numHarmonies === 3 ? true : !toggleComplement)
    }

    //for submitting to db
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(harmonies)
        const submitHarmonies = []
        const shadesLightness = []
        const shadesSaturation = []
        Object.values(harmonies).map( harmony => submitHarmonies.push(harmony.angle))
        Object.values(shades).map(
            shade => shadesLightness.push(shade.l)
        )
        Object.values(shades).map(
            shade => shadesSaturation.push(shade.s)
        )

        let palette = {
            title: "some title",
            primaryHue: angle,
            numHarmonies: numHarmonies,
            harmonies: submitHarmonies.join(', '),
            shadesSaturation: shadesSaturation.join(', '),
            shadesLightness: shadesLightness .join(', '),
            complement: toggleComplement
        }
        props.createPalette(palette)
            .then(history.push('/profile'))
    }

    //helper methods / component-'constructors'
    ///created some/most of the graphics as returns from helper methods mainly
    ///bc i wanted to keep the functional components return as clean as possible
    ///so i wouldn't get lost inside the return lol

    const createHarmCircle = (harmony, index) => {      //circular handles for harmonies = takes a harmony color and maps it to
                                                        //to a position on our hue circle 
                                                        //for the primary color i did in the return cuz there's just one
        const assignRef = (el) => {harmoniesRef.current[index]= el}
            return(  
        
                < Circle 
                    ref={assignRef}
                    key={harmony.key} 
                    x= {harmony.x} 
                    y= {harmony.y}
                    stroke={'gray'}
                    strokeWidth={5}
                    draggable={toggleHarmonies}
                    dragBoundFunc={bindHandlerDrag}
                    onDragMove={
                        () => { 
                            updateHarm(harmony.key)
                            setFocusHue(harmony.angle)
                        }
                    }
                    width={radius/10} 
                    height={radius/10} 
                    fill={getOneShadeColor(harmony.angle, shades[2].s, shades[2].l)} />
            )
    }

    const createShadeHandle = (shade, index) => {           //maps saturation and light values to a circle
        const assignRef = (el) => {shadesRef.current[index]= el}
        const hue = focusHue
        let stroke
        index === 2 ? stroke = 'black' : stroke = 'gray'

        let width
        index === 2 ? width = radius/12 : width = radius/15
            return( 
                
                <>
                < Circle 
                    ref={assignRef}
                    key={`shade${shade.key}`} 
                    x= {shade.x} 
                    y= {shade.y}
                    stroke={stroke}
                    strokeWidth={5}
                    dragBoundFunc={bindShadeHandlerDrag}
                    draggable
                    onDragMove={ () => {
                        if (!toggleShades) {
                            updateAllShades(shade.key)
                        } else {
                            updateShade(shade.key)
                        }
                    }}
                    width={width} 
                    height={width}
                    fill={getOneShadeColor(hue, shade.s, shade.l)} />
                    
                    </> )
    }

    const renderShadeHandles = () => {
        let shadesArr = Object.values(shades)
        
        return shadesArr.map ((shade, ix) => createShadeHandle(shade, ix))
    }
   
    const renderHarmonies = () => {
        
        let harms = Object.values(harmonies)
        let renderedHarms = []
        harms.map((harmony) => harmony.key < numHarmonies ? renderedHarms.push(harmony) : "")
        return renderedHarms.map( (harmony,ix) => createHarmCircle(harmony, ix))
    }

    const renderComplement = () => {   
        return(<Circle 
        key={`COMP${complement.key}`} 
        x={complement.x} 
        y = {complement.y} 
        width={radius/15} 
        height={radius/15} 
        stroke={'white'}
        strokeWidth={5}
        fill={getOneShadeColor(complement.angle, shades[2].s, shades[2].l)} />)
    }


    //GRAPHICAL ELEMENTS the big square and rectangular things 
    const createPrimaryShades = (x,y, height, width) => {
    //maps our user inputs on the shade and color wheels to colors
    //we love you user :)
        return (
            <>
            <Rect 
                key={'PRIMARYSHD1'}
                x={x + width/20}
                y={y + (height * (6/10))}
                stroke={'gray'}
                strokeWidth={1}
                height={height / 5}
                width = {width / 5}
                fill = {getOneShadeColor(angle, shades[0].s, shades[0].l)}
            />
            <Rect 
                key={"PRIMARYSHD2"}
                x={x + width/20}
                y={y + height * (3/10)}
                height={height / 5}
                width = {width / 5}
                stroke={'gray'}
                strokeWidth={1}
                fill = {getOneShadeColor(angle, shades[1].s, shades[1].l)}
            />
            <Rect 
            key={"PRIMARYSHD3"}
                x={x + (width * 3/10)}
                y={y + (height/20)}
                height={height / 5}
                width = {width / 5}
                stroke={'gray'}
                strokeWidth={1}
                fill = {getOneShadeColor(angle, shades[3].s, shades[3].l)}
            />

            <Rect 
            key={"PRIMARYSHD4"}
                x={x + (width * 6/10)}
                y={y + (height/20)}
                height={height / 5}
                width = {width / 5}
                stroke={'gray'}
                strokeWidth={1}
                fill = {getOneShadeColor(angle, shades[4].s, shades[4].l)}
            />      
            
            
            </>)

    }

    const createPrimarySquare = ()=> {
        if (numHarmonies === 0){
            const x= windowWidth / 2
            const y= centerXY[1] - (radius/2)
            const height= radius 
            const width= radius 
            return (
                <>
                 <Rect
                    key={'PRIMARYSQUARE'}
                    x = {x}
                    y = {y}
                    height = {height}
                    width = {width}
                    fill={getOneShadeColor(angle, shades[2].s, shades[2].l)} />
                {createPrimaryShades(x, y, height, width)}
                </>
            )
        } else {
            const x = windowWidth / 2
            const y = centerXY[1] - (radius/2)
            const height = radius * 2/3 
            const width =radius * 2/3
            return (
                <>
                <Rect
                    key={"PRIMARYMONOSQUARE"}
                    x = {x}
                    y = {y}
                    height = {height}
                    width = {width}
                    
                    fill={getOneShadeColor(angle, shades[2].s, shades[2].l)} />
                    {createPrimaryShades(x, y, height, width)}
                    </>
            )
        }
    }


    //the next are graphical elements for the harmonic colors
    //the colors are generated via user input or
    //calculated based on their input re: the primary colors

    const create2NDShades = (x,y,height, width) => {
        const hue = harmonies[0].angle
        return (
            <>
            <Rect 
                key={"2HARS1"}
                x={x + (width * 5/9)}
                y={y + (height * 10/15)}
                stroke={'gray'}
                strokeWidth={1}
                height={height / 6}
                width = {height / 6}
                fill = {getOneShadeColor(hue, shades[0].s, shades[0].l)}
            />
            <Rect 
            key={"2HARS2"}
                x={x + (width * 5/9)}
                y={y + (height * 7/15)}
                stroke={'gray'}
                strokeWidth={1}
                height={height / 6}
                width = {height / 6}
                fill = {getOneShadeColor(hue, shades[1].s, shades[1].l)}
            />
             <Rect 
             key={"2HARS3"}
                x={x + (width * 5/9)}
                y={y + (height * 4/15)}
                stroke={'gray'}
                strokeWidth={1}
                height={height / 6}
                width = {height / 6}
                fill = {getOneShadeColor(hue, shades[3].s, shades[3].l)}
            />

            <Rect 
            key={"2HARS4"}
                x={x + (width * 5/9)}
                y={y + (height * 1/15)}
                stroke={'gray'}
                strokeWidth={1}
                height={height / 6}
                width = {height / 6}
                fill = {getOneShadeColor(hue, shades[4].s, shades[4].l)}
            />

            </>
        )
    }

    const create2NDHarmSquare = () => {
        const x= windowWidth / 2 + (radius * (2/3))
        const y= centerXY[1] - (radius / 2    )
        const height= radius * (2/3)
        const width=radius / 3 
        
        if (harmonies[0]) {
            let harmony = harmonies[0] 
            return (
                <>
                    <Rect
                    key={"2HAR"}
                        key={harmony.key}
                        x = {x}
                        y = {y}
                        height = {height}
                        width = {width}
                        fill={getOneShadeColor(harmony.angle, shades[2].s, shades[2].l)}
                    /> 
                          {create2NDShades(x,y,height,width)}
                    </>)
      
            }
    }

    const create3RDshades = (x,y,height, width) => {
        const hue = harmonies[1].angle
        return (
            <>
            <Rect 
            key={"3HARS1"}
                y={y + (height * 5/9)}
                x={x + (width * 10/15)}
                stroke={'gray'}
                strokeWidth={1}
                height={width / 6}
                width = {width / 6}
                fill = {getOneShadeColor(hue, shades[0].s, shades[0].l)}
            />
              <Rect 
              key={"3HARS2"}
                y={y + (height * 5/9)}
                x={x + (width * 7/15)}
                stroke={'gray'}
                strokeWidth={1}
                height={width / 6}
                width = {width / 6}
                fill = {getOneShadeColor(hue, shades[1].s, shades[1].l)}
            />
             <Rect 
             key={"3HARS3"}
                y={y + (height * 5/9)}
                x={x + (width * 4/15)}
                stroke={'gray'}
                strokeWidth={1}
                height={width / 6}
                width = {width / 6}
                fill = {getOneShadeColor(hue, shades[3].s, shades[3].l)}
            />
            <Rect 
            key={"3HARS4"}
                y={y + (height * 5/9)}
                x={x + (width * 1/15)}
                stroke={'gray'}
                strokeWidth={1}
                height={width / 6}
                width = {width / 6}
                fill = {getOneShadeColor(hue, shades[4].s, shades[4].l)}
            />
        

            </>
        )
    }

    const create3RDHarmSquare = () => {
        const x= windowWidth / 2 
        const y= centerXY[1] - (radius / 2 ) + (radius *(2/3)) 
        const height= radius/ 3
        const width= radius * (2/3)

        if (harmonies[1]) {
            let harmony = harmonies[1]
            return (<>
                    <Rect
                        key={"3HAR"}
                        x = {x}
                        y = {y}
                        height = {height}
                        width = {width}
                        fill={getOneShadeColor(harmony.angle, shades[2].s, shades[2].l)}
                    />
                    {create3RDshades(x,y, height, width)}
                    </> )
            }
    }

    const create4THshades = (x, y, height, type) => {
        const width = height;
        let hue
        if (type === 'primary') {
            hue = angle;
        } else if (type === '4th harm') {
            hue = harmonies[2].angle 
        } else {
            hue = complement.angle
        }
        return (
            <>
            <Rect 
            key={"4HARS1"}
                x={x + width * 4/20}
                y={y + (height * (14/20))}
                stroke={'gray'}
                strokeWidth={1}
                height={height / 5}
                width = {width / 5}
                fill = {getOneShadeColor(hue, shades[0].s, shades[0].l)}
            />
            <Rect 
            key={"4HARS2"}
                x={x + width * (9/20)}
                y={y + height * (14/20)}
                height={height / 5}
                width = {width / 5}
                stroke={'gray'}
                strokeWidth={1}
                fill = {getOneShadeColor(hue, shades[1].s, shades[1].l)}
            />
            <Rect 
            key={"4HARS3"}
                x={x + (width * 7/10)}
                y={y + (height * 9/20)}
                height={height / 5}
                width = {width / 5}
                stroke={'gray'}
                strokeWidth={1}
                fill = {getOneShadeColor(hue, shades[3].s, shades[3].l)}
            />

<Rect 
key={"4HARS4"}
                x={x + (width * 7/10)}
                y={y + (height * 4/20 )}
                height={height / 5}
                width = {width / 5}
                stroke={'gray'}
                strokeWidth={1}
                fill = {getOneShadeColor(hue, shades[4].s, shades[4].l)}
            />     
        

            </>
        )
    }

    const create4THHarmSquare = () => {
        const x = windowWidth / 2 + (radius * (2/3))
        const y = centerXY[1] - (radius / 2 ) + (radius *(2/3))
        const height = radius / 3 
        if (numHarmonies === 3) {
            if (harmonies[2]) {
                let harmony = harmonies[2]
            return (
                    <>
                    <Rect
                        key={"4HAR"}
                        x={x}
                        y={y}
                        height={height}
                        width={height}
                        fill={getOneShadeColor(harmony.angle, shades[2].s, shades[2].l)}
                     />
                    {create4THshades(x, y, height, '4th harm')}
                    </> )
            }
        } else if (toggleComplement) {
            return (
                <>
                <Rect
                        key={'4HAR'}
                        x={x}
                        y={y}
                        height={height}
                        width={height}
                        fill={getOneShadeColor(complement.angle, shades[2].s, shades[2].l)}
                    />
                {create4THshades(x, y, height, 'complement')}
                </>
            )
        } else {
            return (
                <>
                <Rect
                key={'4HAR'}
                x={x}
                y={y}
                height={height}
                width={height}
                fill={getOneShadeColor(angle, shades[2].s, shades[2].l)}
                />
                {create4THshades(x, y, height, 'primary')}

                </>
            )
        }

    

    }



    useEffect( () => {
        !toggleHarmonies && updateAllHarmonies()

        if (toggleHarmonies) {
            for (let i = 0; i < numHarmonies; i++) {
                if (Object.values(harmonies).length < numHarmonies && !harmonies[i])
                { addHarm(i) }            
            }
        }
        if (numHarmonies === 3) {
            setToggleComplement(false);
        }            

    }, [toggleHarmonies, numHarmonies, angle, shades, toggleShades, focusHue])

   //image downloads:
         // function from https://stackoverflow.com/a/15832662/512042
        const downloadURI = (uri, name) => {
            var link = document.createElement('a');
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
    


    return (
        <>
        <Stage 
            ref={stage} 
            width={window.innerWidth} 
            height={window.innerHeight} >
                <Layer key={"notlistening"} listening={false}>   
                    {/* this layer is not listening for any user input which improves performance,
                    so our HTML elements and graphical components which are not being directly manipulated
                    will be placed her*/}
                
                <Html key={"html"} transform={true} 
                    divProps={{
                        style: {
                            display: "flex",
                        }
                    }}>

                    {/*Select for number of harmonies - just fyi these notes are mainly for myself
                    to not get lost in the sauce*/}
                    <FormControl key={"NumHar"} variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel key={"typeinput"}>Type</InputLabel>
                    <Select
                    key={"harmsselect"}
                    value={numHarmonies}
                    onChange={(e) => {
                        setNumHarmonies(e.target.value)
                    }}>
                    <MenuItem key={"MONO"} value={0}>Monochrome</MenuItem>
                    <MenuItem key={"TRIAD"} value={2}>Triad</MenuItem>
                    <MenuItem key={"TETRAD"} value={3}>Tetrad</MenuItem>
                    </Select>
                    </FormControl>

                    {/*Select for toggle harmonies */}
                    <FormControl key={"typeHarm"} variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel key={'harminput'}>Harmonies</InputLabel>
                    <Select
                    value={toggleHarmonies}
                    onChange={handleToggleHarmoniesInput}
                    >
                    <MenuItem key={"CUSTOM"} value={true}>Custom</MenuItem>
                    <MenuItem key={"FIXED"} value={false}>Fixed</MenuItem>
                    </Select>
                    </FormControl>
                    {numHarmonies < 3  && 
                    <Button 
                        key={"TOGGLECOMP"}
                        variant="contained" 
                        onClick={handleToggleComplementInput}>
                            {toggleComplement ? "Remove Complement" : "Add Complement"} 
                    </Button>
                    }
                    <Button 
                        key={'TOGGLESHADES'}
                        variant="contained" 
                        onClick={() => {setToggleShades(!toggleShades)} }>
                            {toggleShades ? "Adjust All Shades" : "Adjust Shades Individually"} 
                    </Button>
                    <Button
                        key={'DOWNLOAD'}
                        variant="contained"
                        onClick={ () => {
                            let dataURL = stage.current.toDataURL({ pixelRatio: 1 });
                            downloadURI(dataURL, 'stage.png');
                            }}
                        >
                            Download your palette
                        </Button>
                        <Button
                            key={'save'}
                            variant="contained"
                            onClick={handleSubmit}
                            > Save Your Palette</Button>
                </Html>
                   


                   {/* color picker circle */}
                <RainbowFill
                    key={"COLORFILL"}
                    xPos={centerXY[0]} 
                    yPos={centerXY[1]}
                    rad={radius/2}
                 
                />
                   <SatLumCircle 
                   key={"SATLUM"}
                    xPos={centerXY[0]} 
                    yPos={centerXY[1]}
                    rad={satLumRadius}
                    hue={focusHue}
                />
                

                {createPrimarySquare()}
                {create2NDHarmSquare()}
                {create3RDHarmSquare()}
                {create4THHarmSquare()}
                </Layer> 

                <Layer key={"listening"}>
             
                <Circle key={'handlerCircle'} 
                    ref={handlerCircle} 
                    x={handleCenter[0]} 
                    y={handleCenter[1]} 
                    width={radius/8} 
                    height={radius/8}
                    stroke={'black'}
                    strokeWidth={5}
                    fill={getOneShadeColor(angle, shades[2].s, shades[2].l)} 
                    draggable 
                    dragBoundFunc={bindHandlerDrag} 
                    onDragMove={handlerDrag}
                />

                {/* This text box is mainly here for debug and it's commented out 
                but it's here now mainly in honor of how much I used it while debugging
                and fixing my mathetmatical calculations both in mapping user input and 
                displaying it for the automatic modes. */}
                {/* <Text 
                    key={'yalla'} 
                    x={handleCenter[0]}
                    y={handleCenter[1]} 
                    text={`Angle: ${angle} Location: ${handleCenter} From Formula: ${getCirclePoint(angle, dist, centerXY)} Sat: ${saturation}`}/>               */}
                                        

                {/* below are from all of the component creator helper methods
                we detailed above */}
                {harmonies && renderHarmonies()}
                {shades && renderShadeHandles()}
                {(toggleComplement && complement) && renderComplement()}
                </Layer>

               
        </Stage>
        </>
    )
    

}

export default PaletteWheel;