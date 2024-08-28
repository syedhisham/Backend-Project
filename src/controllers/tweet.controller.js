import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    throw new ApiError(401, "Write some content to tweet");
  }

  const user = await User.findById(req.user?._id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const tweet = new Tweet({
    owner: user?._id,
    content: content,
  });

  await tweet.save();
  return res.status(200).json(new ApiResponse(200, {}, "Tweet created"));
});
const getUserTweets = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const tweets = await Tweet.find({ owner: user?._id });
  if (!tweets) {
    throw new ApiError(401, "There are no tweets for this user");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "All tweets are fetched"));
});
const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Please provide content to update the tweet.");
  }
  // Find the specific tweet by its ID
  const tweet = await Tweet.findOne({ _id: req.params.tweetId });
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  tweet.content = content;
  await tweet.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});
const deleteTweet = asyncHandler(async (req, res) => {
  // Find the tweet by ID and delete it
  const tweet = await Tweet.findByIdAndDelete(req.params.tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
