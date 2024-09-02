import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(401, "Enter the comment Id to proceed");
  }
  const userId = req.user?._id;
  const existingCommentlike = await Like.findOne({
    likedBy: userId,
    comment: commentId,
  });

  if (existingCommentlike) {
    const deleteCommentLike = await Like.findOneAndDelete({
      _id: existingCommentlike._id,
    });
    if (!deleteCommentLike) {
      throw new ApiError(
        500,
        "Something went wrong while deleting the comment"
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deleteCommentLike,
          "Comment Like deleted Successfuly"
        )
      );
  }
  if (!existingCommentlike) {
    const likeComment = await Like.create({
      comment: commentId,
      likedBy: userId,
    });
    if (!likeComment) {
      throw new ApiError(500, "Something went wrong while liking the comment");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, likeComment, "Liked the comment successfuly"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId) {
    throw new ApiError(401, "Enter the tweet Id to proceed");
  }
  const userId = req.user?._id;
  const tweetLike = await Like.findOne({
    likedBy: userId,
    tweet: tweetId,
  });
  if (tweetLike) {
    const deleteTweetLike = await Like.findOneAndDelete({
      _id: tweetLike._id,
    });
    if (!deleteTweetLike) {
      throw new ApiError(
        500,
        "Something went wrong while deleting the comment"
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deleteTweetLike,
          "Deleted the tweet like successfuly"
        )
      );
  }
  if (!tweetLike) {
    const likeTheTweet = await Like.create({
      likedBy: userId,
      tweet: tweetId,
    });
    if (!likeTheTweet) {
      throw new ApiError(500, "Something went wrong while liking the tweet");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, likeTheTweet, "Liked the Tweet successfuly"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(401, "Enter the user Id to get all it's liked videos");
  }
  const userLikedVideos = await Like.find({
    likedBy: userId,
  });
  if (!userLikedVideos) {
    throw new ApiError(
      500,
      "Something went wrong while fetching all the liked videos by the user"
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, userLikedVideos, "Fethced all the liked videos")
    );
});
export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
