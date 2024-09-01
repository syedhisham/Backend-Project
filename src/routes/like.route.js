import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();

router.route("/video-likes/:videoId").post(verifyJWT, toggleVideoLike);

export default router;
