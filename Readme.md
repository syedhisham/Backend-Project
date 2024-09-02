## Backend API for Video & Tweet Platform

## Overview

This project provides a backend API for a video and tweet platform, enabling users to manage videos, tweets, playlists, comments, subscriptions, and more. Built with Node.js, express, and Mongoose, this API is designed to be scalable and secure.

## Features

- User Management: User registration, profile updates, and authentication.
- Video Management: Handle video details, views, and interactions.
- Playlist Management: Create, update, and manage playlists.
- Tweet Management: Create, update, and delete tweets.
- Comment Management: Add, update, and delete comments on videos and tweets.
- Subscription Management: Manage user subscriptions to channels.
- Dashboard Management: Retrieve channel statistics.
- Like System: Toggle likes on videos, comments, and tweets.

## Technologies

- Node.js: Backend runtime environment.
- Express.js: Web framework for building APIs.
- MongoDB: NoSQL database for storing data.
- Mongoose: ODM library for MongoDB.
- JWT: For user authentication and authorization.
- Aggregation Pipelines: For complex queries and data manipulation.

## Setup

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the Repository

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Install Dependencies

   ```bash
   npm install
   ```

3. Environment Variables

   Create a `.env` file in the root directory and add the following variables:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=your_preferred_port
   ```

4. Start the Server

   ```bash
   npm start
   ```

   The server will start and listen on the port specified in the `.env` file.

## API Endpoints

### User Endpoints

- POST /api/users/register: Register a new user.
- POST /api/users/login: Log in and receive a JWT token.
- POST /api/users/logout: Log out the current user.
- POST /api/users/refresh-access-token: Refresh the access token.
- POST /api/users/change-password: Change user password.
- GET /api/users/current: Get details of the currently logged-in user.
- PATCH /api/users/update-account-details: Update user account details.
- PATCH /api/users/update-user-avatar: Update user avatar.
- PATCH /api/users/update-user-cover-image: Update user cover image.
- GET /api/users/channel-profile/:userId: Get user channel profile.
- GET /api/users/watch-history: Get watch history of the user.

### Video Endpoints

- POST /api/videos: Upload a new video.
- GET /api/videos: Retrieve all videos.
- GET /api/videos/:id: Retrieve video details by ID.
- DELETE /api/videos/:id: Delete a video by ID.
- PATCH /api/videos/:id/publish-status: Update video publish status.
- PATCH /api/videos/:id/views: Increment view count on a video.

### Playlist Endpoints

- POST /api/playlists: Create a new playlist.
- PATCH /api/playlists/:id: Update playlist details.
- POST /api/playlists/:playlistId/videos/:videoId: Add a video to a playlist.
- DELETE /api/playlists/:playlistId/videos/:videoId: Remove a video from a playlist.
- DELETE /api/playlists/:id: Delete a playlist by ID.
- GET /api/playlists/user/:userId: Get all playlists of a user.
- GET /api/playlists/:id: Get playlist details by ID.

### Tweet Endpoints

- POST /api/tweets: Create a new tweet.
- GET /api/tweets: Retrieve all tweets.
- GET /api/tweets/:id: Retrieve tweet details by ID.
- PATCH /api/tweets/:id: Update a tweet by ID.
- DELETE /api/tweets/:id: Delete a tweet by ID.

### Comment Endpoints

- POST /api/comments/video/:videoId: Add a comment to a video.
- POST /api/comments/tweet/:tweetId: Add a comment to a tweet.
- GET /api/comments/video/:videoId: Retrieve comments on a video.
- GET /api/comments/tweet/:tweetId: Retrieve comments on a tweet.
- PATCH /api/comments/:id: Update a comment by ID.
- DELETE /api/comments/:id: Delete a comment by ID.

### Subscription Endpoints

- POST /api/subscriptions/:channelId: Toggle subscription to a channel.
- GET /api/subscriptions/user/:userId: Get subscribers of a user's channel.
- GET /api/subscriptions/user/:userId/subscribed-channels: Get channels the user is subscribed to.

### Dashboard Endpoints

- GET /api/dashboard/channel-stats/:channelId: Get statistics for a channel.

### Like Endpoints

- POST /api/likes/video/:videoId: Like a video.
- DELETE /api/likes/video/:videoId: Remove like from a video.
- POST /api/likes/comment/:commentId: Like a comment.
- DELETE /api/likes/comment/:commentId: Remove like from a comment.
- POST /api/likes/tweet/:tweetId: Like a tweet.
- DELETE /api/likes/tweet/:tweetId: Remove like from a tweet.
- GET /api/likes/user/:userId/liked-videos: Get videos liked by a user.

## Testing

For testing, you can use tools like [Postman](https://www.postman.com/)

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## Contact

For any questions or inquiries, please contact (mailto:syedhishamshah27@gmail.com).

Feel free to modify and expand upon this template as needed to fit your project’s specific requirements and details.

### Notes:
- Replace `your-username`, `your-repo-name`, and other placeholders with actual values relevant to your project.
- Adjust the API endpoint descriptions and setup instructions according to the actual implementation and configuration of your project.
- Include additional sections if necessary, such as for testing, contributing guidelines, or specific details about the API functionality.