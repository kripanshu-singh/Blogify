import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const Authors = () => {
    const [loading, setLoading] = useState(true);
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        const getAuthors = async () => {
            axios
                .get("https://wordwave-jvqf.onrender.com/api/users")
                .then((res) => {
                    // console.log(res.data.data);
                    setAuthors(res.data.data);
                })
                .finally(setLoading(false));
        };
        getAuthors();
    }, []);

    // console.log(`\n ~ Authors ~ loading :- `, loading);
    if (loading) {
        return <Loader />;
    }

    return (
        <section className="authors">
            {authors.length > 0 ? (
                <div className="container authors__container">
                    {authors.map(({ _id, avatar, fullName, posts }) => {
                        return (
                            <Link
                                key={_id}
                                to={`/post/user/${_id}`}
                                className="author"
                            >
                                <div className="author__avatar">
                                    <img
                                        src={avatar}
                                        alt={`Image of ${fullName}`}
                                    />
                                </div>
                                <div className="author__info">
                                    <h4>{fullName}</h4>
                                    <p>{posts} Post</p>
                                </div>
                            </Link>
                        );
                        // console.log(`\n`, _id, avatar, name, post);
                    })}
                </div>
            ) : (
                <h2 className="center">No Authors Found</h2>
            )}
        </section>
    );
};

export default Authors;
