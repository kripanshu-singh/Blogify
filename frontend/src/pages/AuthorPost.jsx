import React, { useState, useEffect } from "react";
import PostItem from "../components/PostItem";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";
import axios from "axios";

const AuthorPost = () => {
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchPost = async () => {
            await axios
                .get(`https://wordwave-jvqf.onrender.com/api/posts/user/${id}`)
                .then((res) => {
                    setPosts(res.data.data);
                    // console.log(
                    // `\n ~ .then ~ res.data.data :- `,
                    // res.data.data
                    // );
                })
                .finally(() => {
                    setLoading(false);
                });
        };
        fetchPost();
    }, []);

    if (loading) {
        return <Loader />;
    }
    return (
        <section className="posts">
            {posts.length > 0 ? (
                <div className="container posts__container">
                    {posts.map(
                        ({
                            _id,
                            title,
                            body,
                            category,
                            thumbnail,
                            creator,
                            createdAt,
                            // authorID,
                        }) => (
                            <PostItem
                                key={_id}
                                postID={_id}
                                thumbnail={thumbnail}
                                category={category}
                                title={title}
                                body={body}
                                creator={creator}
                                createdAt={createdAt}
                            />
                        )
                    )}
                </div>
            ) : (
                <h2 className="center">No Post Found</h2>
            )}
        </section>
    );
};

export default AuthorPost;
