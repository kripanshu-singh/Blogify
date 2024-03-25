import React, { useEffect, useState } from "react";
import PostAuthor from "../components/PostAuthor";
import { Link, useParams } from "react-router-dom";
import js_cookie from "js-cookie";
import Loader from "../components/Loader";
import DeletePost from "./DeletePost";
import axios from "axios";
const PostDetail = () => {
    const Postid = useParams().id;
    const [post, setPost] = useState(null);
    const [creatorID, setCreatorID] = useState(null);
    const [currentUserID, setCurrentUserID] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setloading] = useState(true);
    const accessToken = js_cookie.get("accessToken");
    // if (loading) <Loader />;

    useEffect(() => {
        const getUserFormToken = async () => {
            await axios
                .post(
                    `https://mernblog-dln6.onrender.com/api/users/user_from_token`,
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

    useEffect(() => {
        const fetchPostDetails = async () => {
            await axios
                .get(`https://mernblog-dln6.onrender.com/api/posts/${Postid}`)
                .then((res) => {
                    setCreatorID(res.data.data?.creator);
                    setPost(res.data?.data);
                })

                .finally(() => {
                    setloading(false);
                });
        };
        fetchPostDetails();
    }, []);

    // console.log(`\n ~ PostDetail ~ currentUserID :- `, currentUserID);
    // console.log(`\n ~ PostDetail ~ creatorID :- `, creatorID);
    // console.log(`\n ~ PostDetail ~ post :- `, post);
    if (loading) {
        return <Loader />;
    }
    return (
        <section className="post-detail">
            {error && <p className="error">{error}</p>}
            {post && (
                <div className="container post-detail__container">
                    <div className="post-detail__header">
                        <PostAuthor
                            creator={creatorID}
                            createdAt={post.createdAt}
                        />
                        {currentUserID == creatorID && (
                            <div className="post-detail_buttons">
                                <Link
                                    to={`/post/${Postid}/edit`}
                                    className="btn sm primary"
                                >
                                    Edit
                                </Link>
                                <DeletePost postID={Postid} />
                            </div>
                        )}
                    </div>
                    <h1>{post.title}</h1>
                    <div className="post-detail__thumbnai">
                        <img src={post.thumbnail} alt="thumbnail" />
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: post.body }}></p>
                </div>
            )}
        </section>
    );
};

export default PostDetail;
