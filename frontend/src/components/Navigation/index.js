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
                <img className = "logo" src={AirbnbImage} alt="Home" />
            </NavLink>

            {isLoaded && (
                <div className='nav'>
                    {sessionUser && (
                        <NavLink className="Create" to="/spots/new">
                            Create New Spot
                        </NavLink>
                    )}
                    <ProfileButton user={sessionUser} className="profile-button" />
                </div>
            )}
        </div>
    );
}

export default Navigation;
