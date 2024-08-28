import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

const router = Router();

router
  .route("/toggle-subscription/:channelId")
  .get(verifyJWT, toggleSubscription);
router
  .route("/get-all-subscribers/:channelId")
  .get(verifyJWT, getUserChannelSubscribers);
router
  .route("/get-all-subscribed-to-channels/:channelId")
  .get(verifyJWT, getSubscribedChannels);

export default router;
