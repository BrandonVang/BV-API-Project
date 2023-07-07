import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const isUsernameValid = credential.length >= 4;
    const isPasswordValid = password.length >= 6;

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                } else {
                    setErrors({ credential: "The provided credentials were invalid" });
                }
            });
    };

    useEffect(() => {
        setErrors({});
    }, [credential, password]);

    const handleDemoLogin = (e) => {
        e.preventDefault();
        setCredential("Demo-lition");
        setPassword("password");
        handleSubmit(e);
    };

    return (
        <div className="log">
            <h1>Log In</h1>
            {errors.credential && (
                <p className="error-message">{errors.credential}</p>
            )}
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        placeholder="Username or Email"
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
                <button type="submit" disabled={!isUsernameValid || !isPasswordValid}>
                    Log In
                </button>
                <p className="demo-link" onClick={handleDemoLogin}>
                    Demo User
                </p>
            </form>
        </div>
    );
}

export default LoginFormModal;
