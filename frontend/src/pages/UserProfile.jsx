import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "../images/avatar13.jpg";
import { FaEdit, FaCheck } from "react-icons/fa";
import js_cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
const UserProfile = () => {
    const navigate = useNavigate();
    const accessToken = js_cookie.get("accessToken");
    // console.log(`\n ~ UserProfile ~ accessToken :- `, accessToken);

    useEffect(() => {
        if (!accessToken) navigate("/login");
    }, []);

    const [avatar, setAvatar] = useState("");
    const [loading, setloading] = useState(false);
    const [error, setError] = useState("");
    const [fullName, setFullName] = useState("");
    const [userID, setuserID] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [user, setUser] = useState([]);
    const [isAvatarTouched, setIsAvatarTouched] = useState(false);

    useEffect(() => {
        const getUserFromToken = async () => {
            await axios
                .post(
                    `https://mernblog-dln6.onrender.com/api/users/user_from_token`,
                    {
                        accessToken,
                    }
                )
                .then((res) => {
                    setFullName(res.data.data?.fullName);
                    setEmail(res.data.data?.email);
                    setCurrentPassword(res.data.data?.password);
                    setuserID(res.data?.data?._id);
                    setUser(res.data?.data);
                    setAvatar(res.data?.data?.avatar);
                })
                .catch((error) => {
                    setError(error.message);
                });
        };

        getUserFromToken();
    }, []);

    const changeAvatar = async () => {
        setloading(true);
        setIsAvatarTouched(false);
        const avatarData = new FormData();
        avatarData.set("avatar", avatar);
        await axios
            .post(
                "https://mernblog-dln6.onrender.com/api/users/change_avatar",
                avatarData,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            )
            .then((res) => {
                setAvatar(res?.data?.data?.avatar);
            })
            .finally(() => setloading(false));
    };

    const updateUserDetailFunc = async () => {
        setloading(true);
        await axios
            .patch(
                "https://mernblog-dln6.onrender.com/api/users/edit-user",
                {
                    fullName: fullName,
                    email: email,
                    password: currentPassword,
                    newPassword,
                    confirmPassword,
                },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
            .then((res) => {
                console.log(res?.data);
                navigate("/logout");
            })
            .catch((err) => {
                setError(err.response.data.message);
            })
            .finally(() => {
                setloading(false);
            });
    };

    if (loading) {
        return <Loader />;
    }
    return (
        <section className="profile">
            <div className="container profile__container">
                <Link to={`/myposts/${userID}`} className="btn ">
                    My Posts
                </Link>
                <div className="profile__details">
                    <div className="avatar_wrapper">
                        <div className="profile__avatar">
                            <img src={avatar} alt="" />
                        </div>
                        <form className="avatar__form">
                            <input
                                type="file"
                                name="avatar"
                                id="avatar"
                                onChange={(e) => {
                                    setAvatar(e.target.files[0]);
                                }}
                                accept="png, jpg, jpeg"
                            />
                            <label
                                className="profile__avatar-btn"
                                htmlFor="avatar"
                                onClick={() => setIsAvatarTouched(true)}
                            >
                                <FaEdit />
                            </label>
                        </form>
                        {isAvatarTouched && (
                            <button
                                className="profile__avatar-btn"
                                onClick={changeAvatar}
                            >
                                <FaCheck />
                            </button>
                        )}{" "}
                    </div>
                    <h1>{fullName}</h1>
                    {/*   FORM */}
                    <form
                        className="container form profile__form"
                        onSubmit={updateUserDetailFunc}
                    >
                        {error && (
                            <p className="form__error-message">{error}</p>
                        )}
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
                            placeholder="Current Password"
                            name="password"
                            value={currentPassword}
                            onChange={(e) => {
                                setCurrentPassword(e.target.value);
                            }}
                        />
                        <input
                            type="password"
                            placeholder="New password"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
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
                        <button type="submit" className="btn primary">
                            Update details
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default UserProfile;
