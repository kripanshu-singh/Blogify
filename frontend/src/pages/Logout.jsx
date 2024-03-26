import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import js_cookie from "js-cookie";
import { useSession } from "../contexts/session";

const Logout = () => {
    const navigate = useNavigate();
    const { userLogOut } = useSession();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                // Retrieve access and refresh tokens from cookies
                const accessToken = js_cookie.get("accessToken");
                // console.log(`\n ~ logoutUser ~ accessToken :- `, accessToken);
                const refreshToken = js_cookie.get("refreshToken");
                // console.log(`\n ~ logoutUser ~ refreshToken :- `, refreshToken);
                // Send tokens to backend for logout (if required)
                if (accessToken && refreshToken) {
                    await axios
                        .post(
                            "https://wordwave-jvqf.onrender.com/api/users/logout",
                            {
                                accessToken,
                                refreshToken,
                            }
                        )
                        .then(() => {
                            js_cookie.remove("accessToken");
                            js_cookie.remove("refreshToken");
                            userLogOut();
                            navigate("/");
                        });
                }
                // window.location.reload();
            } catch (error) {
                console.error("Logout failed:", error);
            }
        };
        logoutUser();
    }, []);

    return <></>;
};

export default Logout;
