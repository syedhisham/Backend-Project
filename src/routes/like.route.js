import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";

const router = Router();

router.route("/video-likes/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/comment-likes/:commentId").post(verifyJWT, toggleCommentLike);
router.route("/tweet-likes/:tweetId").post(verifyJWT, toggleTweetLike);
router.route("/liked-videos/:userId").get(verifyJWT, getLikedVideos);

export default router;
