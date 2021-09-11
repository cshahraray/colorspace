import React, { useEffect, useState } from 'react';
import PaletteDetail from "../palettes/palette_detail.js"

const Profile = (props) => {
    
    useEffect(() => {
        props.fetchUserPalettes(props.currentUser.id)
    }, [props.fetchUserPalettes])


    const renderPalettes = () => {
        if (props.palettes && props.palettes.length > 0) {
            return (
                props.palettes.map(palette => (
            <PaletteDetail key={palette._id}
            primaryHue={palette.primaryHue}
            numHarmonies={palette.numHarmonies}
            shadesSaturation={palette.shadesSaturation}
            shadesLightness={palette.shadesLightness} />
            )  ))
        } else {
            return ("This user does not have any palettes yet :(")
        }
            
    }

    return(
        <>
            <h2>All of This User's Palettes</h2>
            <div>
                {renderPalettes()}
            </div>
            
        </>
    )
}

export default Profile