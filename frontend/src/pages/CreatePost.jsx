import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import js_cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const CreatePost = () => {
    const navigate = useNavigate();
    const accessToken = js_cookie.get("accessToken");
    useEffect(() => {
        if (!accessToken) navigate("/login");
    }, []);

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("Uncategorized");
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);
    };
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
        "Entertainment",
        "Lifestyle",
        "Food",
        "Health",
        "Technology",
        "Education",
        "Finance",
        "Fashion_Beauty",
        "DIY_Craft",
        "Uncategorized",
    ];

    // const navigate = useNavigate();
    const createPost = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("body", body);
        formData.append("category", category);
        formData.append("thumbnail", thumbnail);
        await axios
            .post(
                "https://wordwave-jvqf.onrender.com/api/posts/create_post",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )

            .then((res) => {
                // // console.log(`\n ~ registerUser ~ res :- `, res.data.data);
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
        // .finally(navigate("/"));
    };
    if (loading) {
        return <Loader />;
    }
    return (
        <section className="create-post">
            <div className="container">
                <h2>Create Post</h2>
                {error && <p className="error form__error-message">{error}</p>}
                <form className="form create-post__form" onSubmit={createPost}>
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
                        onChange={handleFileChange}
                        accept="png,jpg,jpeg,gif"
                    />

                    <button type="submit" className="btn primary">
                        Create
                    </button>
                </form>
            </div>
        </section>
    );
};

export default CreatePost;
