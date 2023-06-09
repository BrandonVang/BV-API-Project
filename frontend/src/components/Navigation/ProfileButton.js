// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import CreateSpotForm from "./CreateSpot";
import { Link } from 'react-router-dom';
import { editSpots } from "../../store/spots";

import './Navigation.css';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
    };



    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <div className="pButton">
            <button className="profile" onClick={openMenu}>
                <i className="fas fa-bars fa-lg sidebar-icon" />
                <i className="fas fa-user-circle fa-lg" />
            </button>
            <div className={ulClassName} ref={ulRef}>
                {user ? (
                    <div className="op-container">
                        <div>Hello, {user.username}</div>
                        <div>{user.email}</div>
                        <Link to="/spots/current">Manage Spots</Link>
                        <button onClick={logout}>Log Out</button>

                    </div>
                ) : (
                    <>
                        <div>
                            <OpenModalButton
                                buttonText="Sign Up"
                                onButtonClick={closeMenu}
                                modalComponent={<SignupFormModal />}
                            />
                        </div>
                        <div>
                            <OpenModalButton
                                buttonText="Log In"
                                onButtonClick={closeMenu}
                                modalComponent={<LoginFormModal />}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProfileButton;
