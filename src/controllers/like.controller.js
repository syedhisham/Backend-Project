import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(401, "Enter the video Id to proceed");
  }
  const likedByUserId = req.user?._id;
  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: likedByUserId,
  });
  if (existingLike) {
    const deleteExistingLike = await Like.findOneAndDelete({
      _id: existingLike._id,
    });
    if (!deleteExistingLike) {
      throw new ApiError(
        500,
        "Something went wrong while removng the like on the video"
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, deleteExistingLike, "Like deleted successfully")
      );
  } else {
    const newLike = await Like.create({
      video: videoId,
      likedBy: likedByUserId,
    });
    if (!newLike) {
      throw new ApiError(500, "Something went wrong while liking the video");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "The video is liked successfuly"));
  }
});

const toggleCommentLike = asyncHandler(async(req,res) => {
  
})
export { toggleVideoLike };
