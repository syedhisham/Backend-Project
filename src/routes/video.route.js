import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  viewsOnAVideo,
} from "../controllers/video.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/publish-video").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  verifyJWT,
  publishAVideo
);

router.route("/views/:videoId").get(verifyJWT, viewsOnAVideo);
router.route("/user-all-videos").get(verifyJWT, getAllVideos);
router.route("/:videoId").get(verifyJWT, getVideoById);
router.route("/delete-video/:videoId").delete(verifyJWT, deleteVideo);
router.route("/is-published/:videoId").get(verifyJWT, togglePublishStatus);

export default router;
