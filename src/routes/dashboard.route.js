import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getChannelStats } from "../controllers/dashboard.controller.js";

const router = Router();

router.route("/stats/:userId").get(verifyJWT, getChannelStats);
export default router;
