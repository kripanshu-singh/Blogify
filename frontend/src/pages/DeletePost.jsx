import React, { useEffect, useState } from "react";
import js_cookie from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const DeletePost = ({ postID }) => {
    // console.log(`\n ~ DeletePost ~ postID :- `, postID);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [currentUserID, setCurrentUserID] = useState(null);
    const navigate = useNavigate();
    const accessToken = js_cookie.get("accessToken");
    useEffect(() => {
        if (!accessToken) navigate("/login");
    }, []);

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
                    // console.log(res.data.data);
                    setCurrentUserID(res.data?.data?._id);
                })
                .catch((error) => console.log(error.message));
        };
        getUserFormToken();
    }, []);

    const removePost = async () => {
        setLoading(true);
        try {
            await axios
                .delete(
                    `https://wordwave-jvqf.onrender.com/api/posts/delete/${postID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                )
                .then((res) => {
                    if (location.pathname == `/myposts/${currentUserID}`)
                        navigate(0);
                    else navigate("/");
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            // console.log(`\n ~ removePost ~ error :- `, error);
        }
    };

    if (loading) {
        return <Loader />;
    }
    return (
        <Link className="btn sm danger" onClick={() => removePost(postID)}>
            Delete
        </Link>
    );
};

export default DeletePost;
