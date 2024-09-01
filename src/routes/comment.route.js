import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addComment,
  deleteComment,
  getAllComments,
  updateComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/video/:resourceId").post(verifyJWT, addComment);
router.route("/tweet/:resourceId").post(verifyJWT, addComment);
router.route("/video/:resourceId").get(verifyJWT, getAllComments);
router.route("/tweet/:resourceId").get(verifyJWT, getAllComments);
router.route("/update/:commentId").patch(verifyJWT, updateComment);
router.route("/delete/:commentId").delete(verifyJWT, deleteComment);

export default router;
