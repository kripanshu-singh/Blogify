import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        fullName: {
            type: "string",
            required: true,
            trim: true,
            index: true,
        },
        email: {
            type: "string",
            unique: true,
            required: true,
            trim: true,
        },
        password: {
            type: "string",
            required: [true, "Password is required"],
        },
        posts: {
            type: "number",
            default: 0,
        },
        refreshToken: {
            type: "string",
        },
        avatar: {
            type: "string",
        },
        avatarCloudinaryPublic_ID: {
            type: String,
            // required: true,
        },
    },
    { timestamps: true }
);

//! hashing passwords before password save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.pre("findOneAndUpdate", async function (next) {
    if (this._update.password) {
        this._update.password = await bcrypt.hash(this._update.password, 10);
    }
    next();
});

//! creating method to compare the passwords (hashed and OG)
userSchema.methods.isPasswordCorrect = async function (password) {
    // // // console.log(`\n METHOD~ password :- `, password);
    // // // console.log(`\n METHOD~ password :-  ${this.password}`);

    return await bcrypt.compare(password, this.password);
};

//! generating accessToken
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        { _id: this._id, email: this.email },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

//! generating refreshToken
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
};

export const User = model("User", userSchema);
