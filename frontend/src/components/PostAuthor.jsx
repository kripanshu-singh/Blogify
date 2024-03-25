import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import Avatar from "../images/avatar5.jpg";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import js_cookie from "js-cookie";
import axios from "axios";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import Loader from "../components/Loader";
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

// const accessToken = js_cookie.get("accessToken");

const PostAuthor = ({ creator, createdAt }) => {
    const [name, setName] = useState(null);
    const [avatar, setAvatar] = useState(null);
    useEffect(() => {
        const getUserFormID = async () => {
            await axios
                .get(
                    `https://mernblog-dln6.onrender.com/api/users/${creator}`,
                    {
                        // creator,
                    }
                )
                .then((res) => {
                    setName(res.data.data.fullName);
                    setAvatar(res.data.data.avatar);
                })
                .catch((error) => console.log(error.message));
        };
        getUserFormID();
    }, []);

    return (
        <Link to={`/post/user/${creator}`} className="post__author">
            <div className="post__author-avatar">
                <img src={avatar} alt="avatar" />
            </div>
            <div className="post__author-details">
                <h5>{name}</h5>
                <small>
                    <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
                </small>
            </div>
        </Link>
    );
};

export default PostAuthor;
