import axios from "axios";
import js_cookie from "js-cookie";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "https://wordwave-jvqf.onrender.com/api/users/login",
                {
                    email: email,
                    password: password,
                }
            );
            // console.log(response.data);
            // console.log(
            //     `\n ~ loginUser ~ response.data.accessToken :- `,
            //     response.data.data.accessToken
            // );
            // console.log(
            //     `\n ~ loginUser ~ response.data.data.refreshToken :- `,
            //     response.data.data.refreshToken
            // );
            const accessToken = response.data.data.accessToken;

            const refreshToken = response.data.data.refreshToken;

            // Store access token and refresh token as cookies using js-cookie
            js_cookie.set("accessToken", accessToken, { expires: 1 });
            js_cookie.set("refreshToken", refreshToken, { expires: 10 }); // Set expiry for refresh token (e.g., 7 days)
            navigate("/");
            window.location.reload();
        } catch (error) {
            setError(error.response.data.message || "Error! Please try again");
        }
    };

    return (
        <section className="login">
            <div className="container">
                <h2>Log In</h2>
                <form className="form login__form" onSubmit={loginUser}>
                    {error && <p className="form__error-message">{error} </p>}
                    <input
                        type="text"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="btn primary">
                        Log In
                    </button>
                </form>
                <small>
                    Don't have an account?
                    <Link to="/register"> Sign Up</Link>
                </small>
            </div>
        </section>
    );
};

export default Login;
