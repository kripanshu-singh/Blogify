import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import axios from "axios";
import Loader from "./Loader";
// import { Dummy_Post } from "../data";

const Posts = () => {
    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchPost = async () => {
            await axios
                .get("https://mernblog-dln6.onrender.com/api/posts")
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
                            _id: id,
                            title,
                            body,
                            category,
                            thumbnail,
                            creator,
                            createdAt,
                            // authorID,
                        }) => (
                            <PostItem
                                key={id}
                                postID={id}
                                thumbnail={thumbnail}
                                category={category}
                                title={title}
                                body={body}
                                creator={creator}
                                createdAt={createdAt}
                                // authorID={authorID}
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

export default Posts;
