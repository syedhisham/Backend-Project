import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(401, "Please add title and description");
  }
  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(401, "Select a video and thumbnail files to upload");
  }
  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile || !thumbnail || !videoFile.url || !thumbnail.url) {
    throw new ApiError(
      500,
      "Video and/or thumbnail not uploaded to Cloudinary"
    );
  }

  const videoDuration = videoFile.duration;
  const user = await User.findById(req.user?._id).select("-password");

  const video = new Video({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    duration: videoDuration,
    isPublished: true,
    owner: user?._id,
  });
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Published successfuly"));
});
const viewsOnAVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.views += 1;
  await video.save();

  // Add the video to the user's watch history
  await User.findByIdAndUpdate(userId, {
    $addToSet: { watchHistory: videoId },
  });

  return res.status(200).json(new ApiResponse(200, video, "Video watched"));
});
const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "views",
    sortType = "desc",
    userId,
  } = req.query;

  // Validate user

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Build the search query for videos
  let searchQuery = { owner: userId };
  if (query) {
    searchQuery.title = { $regex: query, $options: "i" }; // Case-insensitive search by title
  }

  // Determine sort options
  let sortOptions = {};
  sortOptions[sortBy] = sortType === "asc" ? 1 : -1;

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Fetch videos with pagination and sorting
  const videos = await Video.find(searchQuery)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

  // Check if videos are found
  if (videos.length === 0) {
    throw new ApiError(404, "No videos found for this user");
  }

  // Fetch total count for pagination metadata
  const totalVideos = await Video.countDocuments(searchQuery);

  // Send the response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        page: Number(page),
        limit: Number(limit),
        totalVideos,
        videos,
      },
      "All videos are fetched"
    )
  );
});
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(401, "Enter the video id to find the video");
  }
  const video = await Video.findOne({ _id: videoId });
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "The video is fetched successfuly"));
});
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(401, "Enter the video Id to delete the video");
  }

  const findVideo = await Video.findById(videoId);
  if (!findVideo) {
    throw new ApiError(404, "Video not found");
  }

  const videoPublicUrl = findVideo.videoFile;
  const thumbnailPublicUrl = findVideo.thumbnail;

  const videoDeleteResponse = await deleteFromCloudinary(
    videoPublicUrl,
    "video"
  );
  const thumbnailDeleteResponse = await deleteFromCloudinary(
    thumbnailPublicUrl,
    "image"
  );

  if (
    videoDeleteResponse.result !== "ok" ||
    thumbnailDeleteResponse.result !== "ok"
  ) {
    throw new Error("Video or thumbnail not deleted from Cloudinary");
  }

  const video = await Video.findOneAndDelete({ _id: videoId });
  if (!video) {
    throw new ApiError(404, "Video not found in the database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});
const togglePublishStatus = asyncHandler(async(req,res) => {
  const {videoId} = req.params

  const video = await Video.findById(videoId)

  video.isPublished = true
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      video,
      "Video is published"
    )
  )
})

export {
  publishAVideo,
  viewsOnAVideo,
  getAllVideos,
  getVideoById,
  deleteVideo,
  togglePublishStatus
};