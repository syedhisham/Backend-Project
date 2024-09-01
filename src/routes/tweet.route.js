import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create-tweet").post(verifyJWT, createTweet);
router.route("/get-tweets").get(verifyJWT, getUserTweets);
router.route("/update-tweet/:tweetId").patch(verifyJWT, updateTweet);
router.route("/delete-tweet/:tweetId").delete(verifyJWT, deleteTweet);

export default router;
