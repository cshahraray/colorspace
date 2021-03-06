// src/components/app.js

import React from 'react';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch } from 'react-router-dom';

import MainPage from './main/main_page';
import NavBarContainer from './nav/navbar_container';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import PalettesContainer from './palettes/palettes_container';
import PaletteWheel from './palettes/create palette/palette_wheel_container';
import UserProfileContainer from './profile/profile_container';
const App = () => (
    <>
    <NavBarContainer />
    <Switch>
        <AuthRoute exact path="/" component={MainPage} />
        <AuthRoute exact path="/login" component={LoginFormContainer} />
        <AuthRoute exact path="/signup" component={SignupFormContainer} />

        <ProtectedRoute exact path="/palettes" component={PalettesContainer} />
        <ProtectedRoute exact path="/profile" component={UserProfileContainer} />
        <ProtectedRoute exact path="/createPalette" component={PaletteWheel} />

    </Switch>
    </>
);

export default App;