import React from "react";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

const PostItem = ({
    postID,
    thumbnail,
    title,
    category,
    body,
    creator,
    createdAt,
}) => {
    const shortPostBody =
        body.length > 145 ? body.substr(0, 145) + "..." : body;
    const shortPostTitle =
        title.length > 30 ? title.substr(0, 30) + "..." : title;
    return (
        <article className="post">
            <div className="post__thumbnail">
                <Link to={`/posts/${postID}`}>
                    <img src={thumbnail} alt={title} />
                </Link>
            </div>

            <div className="post__content">
                <Link to={`/posts/${postID}`}>
                    <h3>{shortPostTitle}</h3>
                    <p dangerouslySetInnerHTML={{ __html: shortPostBody }}>
                        {/* {shortPostBody} */}
                    </p>
                </Link>
                <div className="post__footer">
                    <PostAuthor creator={creator} createdAt={createdAt} />
                    <Link
                        to={`/post/categories/${category}`}
                        className="btn categoriy"
                    >
                        {category}
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default PostItem;
