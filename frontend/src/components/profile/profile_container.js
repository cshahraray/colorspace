import { connect } from 'react-redux';
import { fetchUserPalettes } from '../../actions/palette_actions';
import Profile from './profile';

const mSTP = (state) => {
    return {
      palettes: Object.values(state.palettes.user),
      currentUser: state.session.user
    };
};

const mDTP = dispatch => {
    return {
      fetchUserPalettes: id => dispatch(fetchUserPalettes(id))
    };
  };

  export default connect(mSTP, mDTP)(Profile);