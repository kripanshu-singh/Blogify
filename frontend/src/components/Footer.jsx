import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
    return (
        <footer>
            <ul className="footer__categories">
                <li>
                    <Link to="/post/categories/Travel">Travel</Link>
                </li>
                <li>
                    <Link to="/post/categories/Entertainment">
                        Entertainment
                    </Link>
                </li>
                <li>
                    <Link to="/post/categories/Lifestyle">Lifestyle</Link>
                </li>
                <li>
                    <Link to="/post/categories/Food">Food</Link>
                </li>
                <li>
                    <Link to="/post/categories/Fitness">Health</Link>
                </li>
                <li>
                    <Link to="/post/categories/Technology">Technology</Link>
                </li>
                <li>
                    <Link to="/post/categories/Education">Education</Link>
                </li>
                <li>
                    <Link to="/post/categories/Finance">Finance</Link>
                </li>
                <li>
                    <Link to="/post/categories/Fashion_Beauty">
                        Fashion/Beauty
                    </Link>
                </li>
                <li>
                    <Link to="/post/categories/DIY_Craft">DIY</Link>
                </li>
                <li>
                    <Link to="/post/categories/Uncategorised">
                        Uncategorised
                    </Link>
                </li>
            </ul>
            <div className="footer__copyright">
                <small>All rights are reserved</small>
            </div>
        </footer>
    );
};

export default Footer;
