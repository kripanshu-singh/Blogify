import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const authentication = asyncHandler(async (req, res, next) => {
    try {
        //!getting tokens
        const token =
            req.cookies?.accessToken ||
            req.body?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        // console.log(`\n ~ authentication ~ token :- `, token);

        //! check if we get tokens
        if (!token) throw new ApiError(400, "Unauthorised request");

        //! decode the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log(`\n ~ authentication ~ decodedToken :- `, decodedToken);

        //! finding user with the help of decodedToken
        const user = await User.findById(decodedToken?._id).select(
            "-password -accessToken"
        );
        // console.log(`\n ~ authentication ~ user :- `, user);

        //! check if user exist?
        if (!user) throw new ApiError(400, "user not found");

        //! add new object to req like (req.body)
        req.user = user;

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access-Token");
    }
});

export { authentication };
