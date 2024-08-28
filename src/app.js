import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); //For handling form data (configuration)
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //For handling URL data (configuration)
app.use(express.static("public")); //For public assets (configuration)
app.use(cookieParser());

//routes import
import userRoutes from "./routes/user.route.js"
import tweetRoutes from "./routes/tweet.route.js"
import videoRoutes from "./routes/video.route.js"
import subscriptionRoutes from "./routes/subscription.route.js"

//routes declaration
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/tweets", tweetRoutes)
app.use("/api/v1/videos", videoRoutes)
app.use("/api/v1/subscriptions", subscriptionRoutes)

export { app };
