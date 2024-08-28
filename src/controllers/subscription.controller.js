import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) {
    throw new ApiError(401, "Insert Channel ID to search for the channel");
  }
  const userId = req.user?._id;
  // Check if subscription exists
  let subscription = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });

  let isSubscribed;
  if (subscription) {
    // If subscription exists, toggle it (unsubscribe)
    await Subscription.deleteOne({ _id: subscription._id });
    isSubscribed = false;
    console.log("Unsubscribed successfully");
  } else {
    // If no subscription exists, create one (subscribe)
    subscription = await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });
    isSubscribed = true;
    console.log("Subscribed successfully");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isSubscribed,
        subscription,
      },
      "Subscription status toggled successfully"
    )
  );
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) {
    throw new ApiError(401, "Insert channel Id to retrieve the subscribers");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
      },
    },
    {
      $unwind: "$subscriberDetails",
    },
    {
      $group: {
        _id: "channel",
        subscribersCount: { $sum: 1 },
        subscribers: {
          $push: {
            fullName: "$subscriberDetails.fullName",
            email: "$subscriberDetails.email",
            username: "$subscriberDetails.username",
            avatar: "$subscriberDetails.avatar",
            coverImage: "$subscriberDetails.coverImage",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        subscribersCount: 1,
        subscribers: 1,
      },
    },
  ]);

  if (subscribers.length === 0) {
    throw new ApiError(404, "No subscribers for this channel");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribers,
        "All the subscribers for this channel are fetched"
      )
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) {
    throw new ApiError(
      401,
      "Enter channel Id to show which channels it is subscribed to"
    );
  }
  const channels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscribedTo",
      },
    },
    {
      $unwind: "$subscribedTo",
    },
    {
      $group: {
        _id: "$subscriber",
        subscribedToCount: { $sum: 1 },
        subscribedChannels: {
          $push: {
            fullName: "$subscribedTo.fullName",
            username: "$subscribedTo.username",
            email: "$subscribedTo.email",
            avatar: "$subscribedTo.avatar",
            coverImage: "$subscribedTo.coverImage",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        subscribedToCount: 1,
        subscribedChannels: 1,
      },
    },
  ]);

  if (channels.length === 0) {
    throw new ApiError(404, "This channel is not subscribed to any channel");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channels[0],
        "All the channels this channel is subscribed to are fetched"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
