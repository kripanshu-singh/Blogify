import { Router } from "express";
import { authentication } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
    createPost,
    getAllPosts,
    getSinglePost,
    getPostByCategory,
    getPostByUser,
    editPost,
    deletePost,
} from "../controllers/post.controller.js";

const router = Router();

router
    .route("/create_post")
    .post(authentication, upload.single("thumbnail"), createPost);

router.route("/").get(getAllPosts);
router.route("/:id").get(getSinglePost);
router.route("/category/:category").get(getPostByCategory);
router.route("/user/:id").get(getPostByUser);
router
    .route("/edit/:id")
    .patch(authentication, upload.single("thumbnail"), editPost);

router.route("/delete/:id").delete(authentication, deletePost);
export default router;
