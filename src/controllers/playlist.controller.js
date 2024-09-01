import { Playlist } from "../models/playlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    throw new ApiError(401, "Enter the name and the description");
  }
  const user = req.user?._id;
  const playlist = await Playlist.create({
    name: name,
    description: description,
    owner: user,
  });
  if (!playlist) {
    throw new ApiError(500, "Something went wrong while creating the playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(401, "Enter the user Id to get the playlists");
  }

  const playlists = await Playlist.find({
    owner: userId,
  });
  if (playlists.length === 0) {
    throw new ApiError(404, "There are no playlists of this user");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlists,
        "All the playlists of the user are fetched"
      )
    );
});
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    throw new ApiError(401, "Enter the playlist Id to search the playlist");
  }

  const playlist = await Playlist.findOne({
    _id: playlistId,
  });
  if (!playlist) {
    throw new ApiError(404, "PLaylist not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId) {
    throw new ApiError(401, "Enter playlist and video Id to proceed");
  }
  const addAVideoToPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId },
    {
      $push: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  );
  if (!addAVideoToPlaylist) {
    throw new ApiError(
      500,
      "Something went wrong while adding the video to the playlist"
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        addAVideoToPlaylist,
        "Video added to playlist successfuly"
      )
    );
});
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId) {
    throw new ApiError(401, "Enter the playlist and video Id to proceed");
  }
  const deleteVideoFromPLaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId },
    {
      $pull: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  );

  if (!deleteVideoFromPLaylist) {
    throw new ApiError(
      500,
      "Something went wrong while deleting the video from the playlist"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deleteVideoFromPLaylist,
        "Video deleted from the playlist successfuly"
      )
    );
});
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    throw new ApiError(401, "Enter the playlist Id to proceed");
  }
  const playlist = await Playlist.findOneAndDelete({ _id: playlistId });
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist deleted successfuly"));
});
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!playlistId || (!name && !description)) {
    throw new ApiError(
      401,
      "Playlist ID is required, and either name or description must be provided."
    );
  }

  const playlistToEdit = await Playlist.findOneAndUpdate(
    { _id: playlistId },
    {
      $set: {
        name,
        description,
      },
    },
    { new: true }
  );

  if (!playlistToEdit) {
    throw new ApiError(500, "Something went wrong while updating the playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlistToEdit, "PLaylist Edited successfuly"));
});
export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
