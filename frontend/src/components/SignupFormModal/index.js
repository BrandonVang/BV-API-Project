import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const isFormValid = () => {
        return (
            email.trim() !== "" &&
            username.trim().length >= 4 &&
            firstName.trim() !== "" &&
            lastName.trim() !== "" &&
            password.length >= 6 &&
            password === confirmPassword
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        if (isFormValid()) {
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password,
                })
            )
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors(data.errors);
                    }
                });
        }
    };

    return (
        <div className="signup-form">
            <h1>Sign Up</h1>
            <div className = "error-message">
            {errors.email && <p>{errors.email}</p>}
            {errors.lastName && <p>{errors.lastName}</p>}
            {errors.firstName && <p>{errors.firstName}</p>}
            {errors.lastName && <p>{errors.lastName}</p>}
            {errors.username && <p>{errors.username}</p>}
            {errors.password && <p>{errors.password}</p>}
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
            </div>
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        required
                    />
                </label>
                <label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        required
                    />
                </label>
                <label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                </label>
                <label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                </label>
                <label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                </label>
                <label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                    />
                </label>
                <button type="submit" disabled={!isFormValid()}>
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default SignupFormModal;
