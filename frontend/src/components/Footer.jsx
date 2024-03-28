import React from "react";
import { FaFly } from "react-icons/fa";
import {
    PiBook,
    PiBooks,
    PiBooksBold,
    PiBooksDuotone,
    PiMaskHappyDuotone,
} from "react-icons/pi";
import { IoBicycleSharp } from "react-icons/io5";
import { IoFastFoodSharp } from "react-icons/io5";
import { FaHeartbeat } from "react-icons/fa";
import { GrTechnology } from "react-icons/gr";
import { PiBooksFill } from "react-icons/pi";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { GiTravelDress } from "react-icons/gi";
import { SiSnapcraft } from "react-icons/si";
import { FaCircleQuestion } from "react-icons/fa6";

import { Link } from "react-router-dom";
const Footer = () => {
    return (
        <footer>
            <ul className="footer__categories">
                <li>
                    <Link to="/post/categories/Travel">
                        <FaFly className="footerIcon" />
                        Travel
                    </Link>
                </li>
                <li>
                    <Link to="/post/categories/Entertainment">
                        <PiMaskHappyDuotone className="footerIcon" />
                        Entertainment
                    </Link>
                </li>
                <li>
                    <Link to="/post/categories/Lifestyle">
                        <IoBicycleSharp className="footerIcon" />
                        Lifestyle
                    </Link>
                </li>
                <li>
                    <Link to="/post/categories/Food">
                        <IoFastFoodSharp className="footerIcon" />
                        Food
                    </Link>
                </li>
                <li>
                    <Link to="/post/categories/Fitness">
                        <FaHeartbeat className="footerIcon" />
                        Health
                    </Link>
                </li>

                <li>
                    <Link to="/post/categories/Technology">
                        <GrTechnology className="footerIcon" />
                        Technology
                    </Link>
                </li>
                <li>
                    <Link to="/post/categories/Education">
                        <PiBooksBold className="footerIcon" />
                        Education
                    </Link>
                </li>
                <li>
                    <Link to="/post/categories/Finance">
                        <FaMoneyBillTrendUp className="footerIcon" />
                        Finance
                    </Link>
                </li>
                <li>
                    <Link to="/post/categories/Fashion_Beauty">
                        <GiTravelDress className="footerIcon" />
                        Fashion/Beauty
                    </Link>
                </li>
                <li>
                    <Link to="/post/categories/DIY_Craft">
                        <SiSnapcraft className="footerIcon" />
                        DIY
                    </Link>
                </li>
                <li>
                    <Link to="/post/categories/Uncategorised">
                        <FaCircleQuestion className="footerIcon" />
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
