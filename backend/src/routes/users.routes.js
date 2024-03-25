import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    registerUser,
    loginUser,
    getUsers,
    getAuhors,
    changeAvatar,
    renewAccessToken,
    updateUserDetails,
    logoutUser,
    getUserFromToken,
} from "../controllers/user.controllers.js";
import { authentication } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(upload.none(), loginUser);
router.route("/get_user_ID").post(authentication, upload.none());
router.route("/logout").post(authentication, logoutUser);
router.route("/:id").get(getUsers);
router.route("/").get(getAuhors);
router.route("/renew-access-token").post(authentication, renewAccessToken);
router
    .route("/change_avatar")
    .post(authentication, upload.single("avatar"), changeAvatar);

router.route("/edit-user").patch(authentication, updateUserDetails);
router.route("/user_from_token").post(authentication, getUserFromToken);
export default router;
