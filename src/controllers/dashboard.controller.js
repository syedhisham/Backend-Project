import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const { userId } = req.params;
  
    if (!userId) {
      throw new ApiError(401, "Enter the user Id to proceed");
    }
    const allVideos = await Video.find({ owner: userId });
    if (!allVideos || allVideos.length === 0) {
      throw new ApiError(404, "User not found or no videos available");
    }
    const totalViews = allVideos.reduce((total, video) => total + video.views, 0);

    const totalLikes = await Like.countDocuments({ likedBy: userId });

    const totalSubscribers = await Subscription.countDocuments({ channel: userId });
    const totalSubscribedTo = await Subscription.countDocuments({ subscriber: userId });

    return res.status(200).json(
      new ApiResponse(200, {
        "Total Views": totalViews,
        "Total Likes": totalLikes,
        "Total Subscribers": totalSubscribers,
        "Total Subscribed To": totalSubscribedTo,
        "All Videos": allVideos
      })
    );
  });
  

export { getChannelStats };
