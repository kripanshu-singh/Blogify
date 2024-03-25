import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "../utils/ApiError.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const deleteFromCloudinary = async (publicId) => {
    // console.log(`\n ~ deleteFromCloudinary ~ publicId :- `, publicId);
    try {
        const response = await cloudinary.uploader.destroy(publicId);
        // console.log(`\n ~ deleteFromCloudinary ~ response :- `, response);
        return response;
    } catch (error) {
        throw new ApiError("Couldn't delete from cloudinary");
    }
};

export default deleteFromCloudinary;
