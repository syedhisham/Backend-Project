import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    throw new ApiError(401, "Enter some content to comment");
  }
  const { resourceId } = req.params;
  const { type } = req.query;

  if (!resourceId || !type) {
    throw new ApiError(401, "Enter a valid resource Id and type");
  }

  const ownerId = req.user?._id;
  if (type === "video") {
    const video = await Video.findOne({ _id: resourceId });
    if (!video) {
      throw new ApiError(404, "No video found for this Id");
    }
    const commentOnVideo = await Comment.create({
      content,
      video: resourceId,
      owner: ownerId,
    });
    if (!commentOnVideo) {
      throw new ApiError(
        500,
        "Something went wrong while adding comment on the video"
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, commentOnVideo, "Comment added on the video"));
  } else if (type === "tweet") {
    const tweet = await Tweet.findOne({ _id: resourceId });
    if (!tweet) {
      throw new ApiError(404, "Tweet not found");
    }
    const commentOnTweet = await Comment.create({
      content,
      tweet: resourceId,
      owner: ownerId,
    });
    if (!commentOnTweet) {
      throw new ApiError(
        500,
        "Something went wrong while adding comment on the Tweet"
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          commentOnTweet,
          "Comment on the Tweet added successfuly"
        )
      );
  } else {
    throw new ApiError(400, "Invalid request");
  }
});

const getAllComments = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;
  const { page = 1, limit = 10, type } = req.query;
  if (!resourceId || !type) {
    throw new ApiError(401, "Enter the resource Id and the type to proceed");
  }

  if (type === "video") {
    const commentsOnVideo = await Comment.find({ video: resourceId });
    if (!commentsOnVideo) {
      throw new ApiError(404, "There are no comments on the video");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          commentsOnVideo,
          "All the comments on the video are fetched"
        )
      );
  } else if (type === "tweet") {
    const commentsOnTweet = await Comment.find({ tweet: resourceId });
    if (!commentsOnTweet) {
      throw new ApiError(404, "There are no comments on the tweet");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          commentsOnTweet,
          "All the comments on the tweet are fetched"
        )
      );
  } else {
    throw new ApiError(400, "Invalid request");
  }
});

const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    throw new ApiError(401, "Add content to to update the comment");
  }
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(401, "Comment Id is required");
  }
  const comment = await Comment.findOneAndUpdate(
    { _id: commentId },
    { content: content }
  );
  if (!comment) {
    throw new ApiError(500, "Something went wrong while updating the comment");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment Updated successfuly"));
});

const deleteComment = asyncHandler(async(req,res) => {
  const { commentId} = req.params
  if (!commentId) {
    throw new ApiError(201, "Comment Id is required")
  }
  const commentToDelete = await Comment.findByIdAndDelete({_id: commentId})
  if (!commentToDelete) {
    throw new ApiError(500, "Something went wrong while deleting the comment")
  }
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      commentToDelete,
      "Comment deleted successfuly"
    )
  )
})

export { addComment, getAllComments, updateComment, deleteComment };
