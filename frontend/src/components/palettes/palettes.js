import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PaletteDetail from './palette_detail';

export const Palettes = (props) => {
    useEffect(() => {
        props.fetchAllPalettes();
    }, [])

    const renderPalettes = () => {
        if (props.palettes.length > 0){
            return (
                <>
                {props.palettes.map(palette => (
                <PaletteDetail key={palette._id}
                primaryHue={palette.primaryHue}
                numHarmonies={palette.numHarmonies}
                shadesSaturation={palette.shadesSaturation}
                shadesLightness={palette.shadesLightness}  />))}
                </>
            )
        } else {
            return (
                <h3>There are no Palettes</h3>
            )
        }
    }
    
    return (
        <>
        {renderPalettes() }
            
        </>
    );
}

export default withRouter(Palettes);