import { Button } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom'

class NavBar extends React.Component {
    constructor(props) {
      super(props);
      this.logoutUser = this.logoutUser.bind(this);
      this.getLinks = this.getLinks.bind(this);
    }
  
    logoutUser(e) {
        e.preventDefault();
        this.props.logout();
    }
  
    // Selectively render links dependent on whether the user is logged in
    getLinks() {
        if (this.props.loggedIn) {
          return (
              <div>

                  <Link to={'/createPalette'}>Create a Color Palette</Link>
                  <Link to={'/profile'}>Your Palettes</Link>
                  <Link to={'/'}>Home</Link>
                  <Button onClick={this.logoutUser}>Logout</Button>
              </div>
          );
        } else {
          return (
              <div>
                  <Link to={'/signup'}>Signup</Link>
                  <Link to={'/login'}>Login</Link>
              </div>
          );
        }
    }
  
    render() {
        return (
          <div>
              <h1>PaletteWheel</h1>
              { this.getLinks() }
          </div>
        );
    }
  }
  
  export default NavBar;