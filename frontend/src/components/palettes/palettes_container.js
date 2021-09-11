import { connect } from 'react-redux';
import { fetchAllPalettes } from '../../actions/palette_actions';
import Palettes from './palettes';


const mapStateToProps = (state) => {
    console.log(state)
    return {
      palettes: Object.values(state.palettes.all)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllPalettes: () => dispatch(fetchAllPalettes())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Palettes)