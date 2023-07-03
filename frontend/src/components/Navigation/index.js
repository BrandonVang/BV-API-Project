import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import AirbnbImage from '../../images/5.PNG';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    return (
        <div className="navigation-container">
            <NavLink exact to="/">
                <img src={AirbnbImage} alt="Home" />
            </NavLink>

            {isLoaded && <ProfileButton user={sessionUser} className="profile-button" />}
        </div>
    );
}

export default Navigation;
