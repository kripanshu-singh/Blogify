import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import js_cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeletePost from "./DeletePost";
import Loader from "../components/Loader";

const DashBoard = () => {
    const navigate = useNavigate();
    const accessToken = js_cookie.get("accessToken");
    useEffect(() => {
        if (!accessToken) navigate("/login");
    }, []);
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [thumbNail, setThumbNail] = useState("");
    const [postID, setPostID] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const getAllPostOfUser = async () => {
            await axios
                .get(`https://wordwave-jvqf.onrender.com/api/posts/user/${id}`)
                .then((res) => {
                    setPosts(res.data.data);
                })
                .finally(() => {
                    setLoading(false);
                });
        };
        getAllPostOfUser();
    }, []);
    if (loading) {
        return <Loader />;
    }
    return (
        <section className="dashboard">
            {posts.length ? (
                <div className="container dashboard__container">
                    {posts.map((post) => {
                        post.title =
                            post.title.length > 80
                                ? post.title.substring(0, 80) + "..."
                                : post.title;
                        return (
                            <article key={post._id} className="dashboard__post">
                                <div className="dashboard__post-info">
                                    <div className="dashboard__post-thumbnail">
                                        <img src={post.thumbnail} alt="" />
                                    </div>
                                    <h5>{post.title}</h5>
                                </div>
                                <div className="dashboard__post-actions">
                                    <Link
                                        to={`/posts/${post._id}`}
                                        className="btn sm"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        to={`/post/${post._id}/edit`}
                                        className="btn sm sm primary"
                                    >
                                        Edit
                                    </Link>
                                    {/* <Link
                                        to={`/post/${post._id}/delete`}
                                        className="btn sm danger"
                                    >
                                        Delete
                                    </Link> */}
                                    <DeletePost postID={post._id} />
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <h2 className="center">You have no post yet.</h2>
            )}
        </section>
    );
};

export default DashBoard;
