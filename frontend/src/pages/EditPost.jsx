import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import js_cookie from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const EditPost = () => {
    const Postid = useParams().id;
    // console.log(`\n ~ EditPost ~ Postid :- `, Postid);
    const navigate = useNavigate();
    const accessToken = js_cookie.get("accessToken");
    useEffect(() => {
        if (!accessToken) navigate("/login");
    }, []);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Uncategorized");
    const [body, setBody] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
    ];

    const POST_CATEGORIES = [
        "Travel",
        "Lifestyle",
        "Food and Cooking",
        "Fitness and Health",
        "Technology",
        "Education",
        "Finance",
        "Fashion_Beauty",
        "DIY_Craft",
        "Uncategorized",
    ];

    useEffect(() => {
        const fetchPostDetails = async () => {
            await axios
                .get(`https://mernblog-dln6.onrender.com/api/posts/${Postid}`)
                .then((res) => {
                    // setCreatorID(res.data.data?.creator);
                    setTitle(res.data?.data.title);
                    setCategory(res.data?.data.category);
                    setBody(res.data?.data.body);
                    setThumbnail(res.data?.data.thumbnail);
                })
                .catch((error) => {
                    setError(error.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        };
        fetchPostDetails();
    }, []);

    const editPost = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("body", body);
        formData.append("category", category);
        formData.append("thumbnail", thumbnail);
        await axios
            .patch(
                `https://mernblog-dln6.onrender.com/api/posts/edit/${Postid}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )
            .then((res) => {
                navigate("/");
            })
            .catch((error) => {
                setError(
                    error.response.data.message || "Error! Please try again"
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };
    if (loading) {
        return <Loader />;
    }
    return (
        <section className="create-post">
            <div className="container">
                <h2>Edit Post</h2>
                {error && <p className="form__error-message">{error}</p>}
                <form className="form create-post__form" onSubmit={editPost}>
                    <input
                        type="text"
                        name="title"
                        id=""
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                    <select
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {POST_CATEGORIES.map((category) => (
                            <option key={category}>{category}</option>
                        ))}
                    </select>
                    <ReactQuill
                        modules={modules}
                        formats={formats}
                        value={body}
                        onChange={setBody}
                    />
                    <input
                        type="file"
                        onChange={(e) => setThumbnail(e.target.files[0])}
                        accept="png,jpg,jpeg,gif"
                    />
                    <button type="submit" className="btn primary">
                        Update
                    </button>
                </form>
            </div>
        </section>
    );
};

export default EditPost;
