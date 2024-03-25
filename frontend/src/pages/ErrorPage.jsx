import React from "react";
import { Link } from "react-router-dom";
import errorlogo from "../images/404.png";
const ErrorPage = () => {
    return (
        <section className="error-page">
            <div className="center">
                <h2>Page Not Found</h2>
                <img src={errorlogo} alt="404 : pageNOTfound" className="errorLogo"/>
                <Link to="/" className="btn primary">
                    Go Back Home
                </Link>
            </div>
        </section>
    );
};

export default ErrorPage;
