import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { returnHealthCheck } from "../controllers/healthCheck.controller.js";

const router = Router();
router.route("/hlc").get(verifyJWT, returnHealthCheck);
export default router;
