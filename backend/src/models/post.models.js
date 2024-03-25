import { Schema, model } from "mongoose";

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        body: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: [
                "Travel",
                "Entertainment",
                "Lifestyle",
                "Food",
                "Health",
                "Technology",
                "Education",
                "Finance",
                "Fashion/Beauty",
                "DIY_Craft",
                "Uncategorized",
            ],
        },
        thumbnail: {
            type: String,
            required: true,
        },
        thumbnailPublicID: {
            type: String,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export const Post = model("Post", postSchema);
