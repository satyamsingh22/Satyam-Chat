import express from "express";
import {
    addComment,
    addNewPost,
    bookmarkPost,
    deletePost,
    dislikePost,
    getAllPost,
    getCommentsOfPost,
    getUserPost,
    likePost
} from "../controllers/post.controller.js";
import isAuthenticated from '../middlewares/isAuthentiacte.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post("/addpost", isAuthenticated, upload.single('image'), addNewPost);
router.get("/all", isAuthenticated, getAllPost);
router.get("/userpost/all", isAuthenticated, getUserPost);
router.delete("/delete/:id", isAuthenticated, deletePost);

router.get("/:id/like", isAuthenticated, likePost);
router.get("/:id/dislike", isAuthenticated, dislikePost);

router.post("/:id/comment", isAuthenticated, addComment);
router.post("/:id/comment/all", isAuthenticated, getCommentsOfPost);

router.get("/:id/bookmark", isAuthenticated, bookmarkPost);

export default router;
