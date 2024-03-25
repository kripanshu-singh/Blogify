import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
const Register = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const registerUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios
                .post(`https://wordwave-jvqf.onrender.com/api/users/register`, {
                    fullName: fullName,
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword,
                })
                .then((res) => {
                    // // console.log(`\n ~ registerUser ~ res :- `, res.data.data);
                    navigate("/login");
                });
            // .finally(() => navigate("/login"));

            // // console.log(`\n ~ registerUser ~ response :- `, response);
        } catch (error) {
            setError(error.response.data.message || "Error! Please try again");
        }
    };

    return (
        <section className="register">
            <div className="container">
                <h2>Sign Up</h2>
                <form className="form register__form">
                    {error && <p className="form__error-message">{error}</p>}
                    <input
                        type="text"
                        placeholder="Full Name"
                        name="name"
                        value={fullName}
                        onChange={(e) => {
                            setFullName(e.target.value);
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Confirm password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                        }}
                    />
                    <button
                        // type="submit"
                        className="btn primary"
                        onClick={registerUser}
                    >
                        Register
                    </button>
                </form>
                <small>
                    All ready have an account?
                    <Link to="/login"> Sign In</Link>
                </small>
            </div>
        </section>
    );
};

export default Register;
