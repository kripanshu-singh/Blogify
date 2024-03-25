import PropType from "prop-types";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import js_cookie from "js-cookie";

const SessionContext = createContext();

function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error(
            "This hook cannot be used outside the SessionProvider Component"
        );
    }
    return context;
}

function SessionProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [userObject, setUserObject] = useState(null);
    // console.log(`\n ~ SessionProvider ~ userObject :- `, userObject);

    const getUserFormToken = async (accessToken) => {
        await axios
            .post(
                `https://wordwave-jvqf.onrender.com/api/users/user_from_token`,
                {
                    accessToken,
                }
            )
            .then((res) => {
                // console.log(`\n ~ .then ~ res :- `, res);

                // setUserID(res?.data?.data?._id);
                setUserObject(res?.data?.data);
            })
            .catch((error) => console.log(error.message));
    };

    useEffect(() => {
        const accessToken = js_cookie.get("accessToken") || null;

        setAccessToken(accessToken);
        if (!userObject && accessToken) {
            getUserFormToken(accessToken);
        }
    }, []);

    const userLogOut = () => {
        setAccessToken(null);
        setUserObject(null);
    };

    const contextValue = {
        userObject,
        accessToken,
        setAccessToken,
        setUserObject,
        userLogOut,
    };
    return (
        <SessionContext.Provider value={contextValue}>
            {children}
        </SessionContext.Provider>
    );
}

SessionProvider.propTypes = {
    children: PropType.element.isRequired,
};

export { useSession, SessionProvider };
