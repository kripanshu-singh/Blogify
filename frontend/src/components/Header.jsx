import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import logo from "../images/logo.jpg";
import logo from "../images/WordWave(1).png";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import js_cookie from "js-cookie";
import axios from "axios";

const Header = () => {
    const [isNavShowing, setIsNavShowing] = useState(
        window.innerWidth > 800 ? true : false
    );
    const accessToken = js_cookie.get("accessToken");

    useEffect(() => {
        const handleResize = () => {
            setIsNavShowing(window.innerWidth > 800 ? true : false);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const toggleNavHandler = () => {
        if (window.innerWidth <= 800) {
            setIsNavShowing(!isNavShowing);
        }
    };
    const [userName, setUserName] = useState(null);
    // const [userID, setUserID] = useState(null);

    useEffect(() => {
        const getUserFormToken = async () => {
            await axios
                .post(
                    `https://wordwave-jvqf.onrender.com/api/users/user_from_token`,
                    {
                        accessToken,
                    }
                )
                .then((res) => {
                    // setUserID(res?.data?.data?._id);
                    setUserName(res?.data?.data?.fullName);
                })
                .catch((error) => console.log(error.message));
        };
        getUserFormToken();
    }, []);
    // console.log(`\n ~ Header ~ user.fullName :- `, userName);
    return (
        <nav>
            <div className="container nav__container">
                <Link to="/" className="nav__logo">
                    <img src={logo} alt="logo" className="headLogo" />
                </Link>

                {!accessToken && isNavShowing && (
                    <ul className="nav__menu">
                        <li>
                            <Link to="/authors">Authors</Link>
                        </li>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                    </ul>
                )}

                {accessToken && isNavShowing && (
                    <ul className="nav__menu">
                        <li>
                            {/* <Link to={`/profile/${userID}`}>{userName}</Link> */}
                            <Link to="/profile">{userName}</Link>
                        </li>
                        <li>
                            <Link to="/create">Create Post</Link>
                        </li>
                        <li>
                            <Link to="/authors">Authors</Link>
                        </li>
                        <li>
                            <Link to="/logout">Logout</Link>
                        </li>
                    </ul>
                )}

                <button
                    className="nav__toggle-btn"
                    onClick={toggleNavHandler} // Use toggleNavHandler instead of setIsNavShowing directly
                >
                    {isNavShowing ? <AiOutlineClose /> : <FaBars />}
                </button>
            </div>
        </nav>
    );
};

export default Header;
