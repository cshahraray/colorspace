import { Button } from '@material-ui/core';
import React from 'react';
import { deletePalette } from '../../util/palettes_api_util';

const PaletteDetail = (props) => {

        return (
            <>
            <ul>
                <li>Primary Hue {props.palette.primaryHue}</li>
                <li>Number of Harmonies {props.palette.numHarmonies}</li>
                <li>Harmonies {props.palette.harmonies}</li>
                <li>Saturation {props.palette.shadesSaturation}</li>
                <li>Lightness {props.palette.shadesLightness}</li>
            </ul>
            <Button
                onClick={deletePalette}
            > Delete </Button>
            </>
        );

}

export default PaletteDetail
