import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import { uploadOnCloudinary } from "../utils/uploadCloudinary.js";
import jwt from "jsonwebtoken";

//! Seeting up cookie's option
//? httpOnly makes our cookies read-only to user (fronted-engneer)
const option = {
    // httpOnly: true,
    // secure: true,
};

//! Generate Tokens
const generateTokens = async (_id) => {
    try {
        console.log(`\n ~ generateTokens ~ _id :- `, _id);
        //! getting user from _id
        const user = await User.findById(_id);
        console.log(`\n ~ generateTokens ~ user :- `, user);

        //! generate tokens
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        console.log(`\n ~ generateTokens ~ accessToken :- `, accessToken);

        console.log(`\n ~ generateTokens ~ refreshToken :- `, refreshToken);

        //! insert refreshToken in user Database
        user.refreshToken = refreshToken;

        //! save
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something Went wrong while generating a refresh-token and access-token."
        );
    }
};

//! It register user
const registerUser = asyncHandler(async (req, res) => {
    //! getting user details from body
    const { fullName, email, password, confirmPassword } = req.body;
    console.log(`\n ~ registerUser ~ req.body :- `, req.body);

    //! chek if we gell all feilds
    if (
        [fullName, email, password, confirmPassword].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields must be filled");
    }

    //! convert email to lower_case
    const toLowerCaseEmail = email.toLowerCase();

    //!TODO
    if (password.trim().length < 6) {
        throw new ApiError(400, "Password should be at least 6 characters");
    }

    //! check wheather password and confirmPassword is same or not
    if (password != confirmPassword) {
        throw new ApiError(400, "please confirm your password correctly");
    }

    //! does toLowerCaseEmail have "@"
    if (!toLowerCaseEmail.includes("@")) {
        throw new ApiError(400, "Enter a valid Email");
    }

    //! checking if user allready exist
    const existUser = await User.findOne({
        email: toLowerCaseEmail,
    });

    //! if user already exists
    if (existUser) {
        throw new ApiError(
            400,
            `user with that ${toLowerCaseEmail} already exists`
        );
    }

    const user = await User.create({
        fullName,
        email: toLowerCaseEmail,
        password,
    });
    console.log(`\n ~ registerUser ~ user :- `, user);

    const createdUser = await User.findById(user._id).select("-password");
    console.log(`\n ~ registerUser ~ createdUser :- `, createdUser);

    if (!createdUser)
        throw new ApiError(500, "Something went wrong, while creating user");

    return res
        .status(200)
        .json(new ApiResponce(200, createdUser, "usre created successfully"));
});

//! It login user with email and password
const loginUser = asyncHandler(async (req, res) => {
    //! getting all users details
    const { email, password } = req.body;
    console.log(`\n ~ loginUser ~ req.body :- `, req.body);

    //! check if we get the details?
    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    //! chek if email have "@"
    if (!email.includes("@")) {
        throw new ApiError(400, "Enter a valid email");
    }
    //! convert email to lower_case
    const toLowerCaseEmail = email.toLowerCase();
    if (password.trim().length < 6) {
        throw new ApiError(400, "Password should be at least 6 characters");
    }

    //! get user from database
    const user = await User.findOne({ email: toLowerCaseEmail });

    //! check if we get user
    if (!user) {
        throw new ApiError(400, "User not found/ does not exist");
    }

    //! compare password
    const passwordValidation = await user.isPasswordCorrect(password);

    //! if password does not match
    if (!passwordValidation) {
        throw new ApiError(400, "Password does not match");
    }

    //! getting and destructuring acessToken and refreshTokens
    const { accessToken, refreshToken } = await generateTokens(user._id);

    //! getting new user AFTER saving refreshToken in it
    const newUser = await User.findById(user._id).select("-password");

    //! returning response and cookie
    return res
        .status(201)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponce(
                200,
                {
                    newUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
});

//! Logout
const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 },
    });

    //! returning response and clearing cookie
    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new ApiResponce(200, {}, "User Logedout"));
});

//! Renew AccessTokesn
const renewAccessToken = asyncHandler(async (req, res) => {
    //! get refreshtoken from userCookies
    console.log(`\n ~ renewAccessToken ~ req.cookies :- `, req.cookies);

    const refreshTokenFromCookies =
        req.cookies.refreshToken || req.body.refreshToken;
    console.log(
        `\n ~ renewAccessToken ~ refreshTokenFromCookies :- `,
        refreshTokenFromCookies
    );

    //! Throw error if refreshToken not found
    if (!refreshTokenFromCookies) {
        throw new ApiError(401, "Token not Found, Unauthorize Request");
    }
    try {
        //! decode the refreshToken
        const decodedRefreshToken = jwt.verify(
            refreshTokenFromCookies,
            process.env.REFRESH_TOKEN_SECRET
        );
        console.log(
            `\n ~ renewAccessToken ~ decodedRefreshToken :- `,
            decodedRefreshToken
        );

        //! If Verification was false
        if (!decodedRefreshToken) {
            throw new ApiError(401, "Invalid Token, Unauthorize Request");
        }

        //! Get all user info from that refreshToken
        const user = await User.findById(decodedRefreshToken?._id);
        console.log(`\n ~ renewAccessToken ~ user :- `, user);

        //! If user was false
        if (!user)
            throw new ApiError(401, "Invalid Token, Unauthorize Request");

        //! Matching refreshTokenFormCookie to refreshToken on D.B
        if (refreshTokenFromCookies !== user.refreshToken)
            throw new ApiError(401, "Invalid Token, Unauthorize Request");

        console.log(`\n ~ renewAccessToken ~ user._id :- `, user._id);
        //! Genetrating access and refresh token
        const { accessToken, refreshToken } = await generateTokens(user._id);

        console.log(`\n ~ renewAccessToken ~ req.cookies :- `, req.cookies);
        console.log(
            `\n ~ renewAccessToken ~ reNewedAccessToken :- `,
            accessToken
        );
        console.log(
            `\n ~ renewAccessToken ~ reNewedRefreshToken :- `,
            refreshToken
        );

        // //! Storing new access and refresh Token to D.B
        // // user.refreshToken = reNewRefreshToken;

        return res
            .status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json(
                new ApiResponce(
                    200,
                    {
                        accessToken,
                        refreshToken,
                    },
                    "AccessToken Renewed successfully"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refreshToken");
    }
});

//! We get(fetch) using user _id from params
const getUsers = asyncHandler(async (req, res) => {
    //! get id from database
    const { id } = req.params;

    //! finding user with id
    const user = await User.findById(id).select("-password");

    //! if user is not found
    if (!user) {
        throw new ApiError(400, "User not found.");
    }

    //! if user found
    return res.status(200).json(new ApiResponce(200, user, "success"));
});

//! We are fetching all the users
const getAuhors = asyncHandler(async (req, res) => {
    const Authors = await User.find().select("-password");

    return res
        .status(200)
        .json(new ApiResponce(200, Authors, "There you have all the authors"));
});

//! Change avatar
const changeAvatar = asyncHandler(async (req, res) => {
    // console.log("Hi");
    //! getting user
    const user = await req.user;
    console.log(`\n ~ changeAvatar ~ user :- `, user);
    //! get OldAvatarPublicId
    const oldAvatarPublicId = await user.avatarCloudinaryPublic_ID;

    //! getting localPath
    const avatarLocalPath = req.file?.path;
    console.log(`\n ~ changeAvatar ~ avatarLocalPath :- `, avatarLocalPath);

    //! if no localPath
    if (!avatarLocalPath) throw new ApiError(402, "No localPath found");

    //! pass localPath to cloudinary
    const avatarOnCloudinary = await uploadOnCloudinary(avatarLocalPath);
    // console.log(
    //     `\n ~ changeAvatar ~ avatarOnCloudinary :- `,
    //     avatarOnCloudinary
    // );

    //! check if file uploaded
    if (!avatarOnCloudinary)
        throw new ApiError(402, "Error while uploading file on database");

    //! set the avatar in user
    user.avatar = avatarOnCloudinary.url;
    user.avatarCloudinaryPublic_ID = avatarOnCloudinary.public_id;
    console.log(`\n ~ changeAvatar ~ NEW :- `, user.avatarCloudinaryPublic_ID);

    try {
        await user.save({ validateBeforeSave: false });
    } catch (error) {
        throw new ApiError(400, "Error saving user avatar");
    }
    const updatedUser = await User.findById(req.user._id).select("-password");

    //! deleteing the avatar from cloudinary using publicID
    console.log(`\n ~ changeAvatar ~ OLD :- `, oldAvatarPublicId);
    if (oldAvatarPublicId) {
        try {
            await deleteFromCloudinary(oldAvatarPublicId);
        } catch (error) {
            throw new ApiError(400, "Error deleting old image from Cloudinary");
        }
    }

    //! return sucess response
    return res
        .status(200)
        .json(new ApiResponce(200, updatedUser, "avatar successfully changed"));
});

//! update user details
const updateUserDetails = asyncHandler(async (req, res) => {
    //! get user details
    const { fullName, email, password, newPassword, confirmPassword } =
        req.body;

    //! check if we get the details?
    if (!fullName || !email || !password || !newPassword || !confirmPassword)
        throw new ApiError(400, "Fill in all the fields");

    //! get the user
    const user = await User.findById(req.user._id);

    if (!user)
        throw new ApiError(400, "wait a minute! who are you? (User not found)");

    let lowerCaseEmail = email.toLowerCase();

    //! make sure that lowerCaseEmail does not exist
    const existingUserWithEmail = await User.findOne({ email: lowerCaseEmail });
    if (!existingUserWithEmail)
        throw new ApiError(400, "wait a minute! who are you? (User not found)");

    //! check if lowerCaseEmail exists and match with current user lowerCaseEmail
    if (
        existingUserWithEmail &&
        existingUserWithEmail._id.toString() !== user._id.toString()
    ) {
        throw new ApiError(400, "This email already exists");
    }
    if (password.trim().length < 6 || newPassword.trim().length < 6) {
        throw new ApiError(400, "Password should be at least 6 characters");
    }

    //! compare the new password and confirm password
    if (newPassword != confirmPassword) {
        throw new ApiError(400, "Confirm your password correctly");
    }

    //! compare entered password with password in DB
    const passwordValidation = await user.isPasswordCorrect(password);

    //! if password does not match
    if (!passwordValidation) {
        throw new ApiError(400, "Password does not match");
    }

    //! set the new details to user
    const newUser = await User.findByIdAndUpdate(
        user._id,
        {
            fullName,
            lowerCaseEmail,
            password: newPassword,
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponce(200, newUser, "User details updated"));
});
const getUserFromToken = asyncHandler(async (req, res) => {
    const user = req.user;
    console.log(`\n ~ getUserFromToken ~ user :- `, user);

    return res.status(200).json(new ApiResponce(200, user, "OK"));
});
export {
    registerUser,
    loginUser,
    getUsers,
    getAuhors,
    changeAvatar,
    updateUserDetails,
    logoutUser,
    renewAccessToken,
    getUserFromToken,
};
