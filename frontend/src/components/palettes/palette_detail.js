import React from 'react';

class PaletteDetail extends React.Component {
    
    render() {
        return (
            <ul>
                <li>Primary Hue {this.props.primaryHue}</li>
                <li>Number of Harmonies {this.props.numHarmonies}</li>
                <li>Harmonies {this.props.harmonies}</li>
                <li>Saturation {this.props.shadesSaturation}</li>
                <li>Lightness {this.props.shadesLightness}</li>
            </ul>
        );
    }
}

export default PaletteDetail
