import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandlers";
import authRouter from "./routes/auth";
import teamRouter from "./routes/team";
import standupRouter from "./routes/standups";
import cors from "cors";
import { requireAuth } from "./middleware/authmiddleware";
import blockerRouter from "./routes/blockers";
import discussionRouter from "./routes/discussion";
const app = express();
const allowedOrigins = [
  "http://localhost:3000", // web dev
  "http://localhost:8081", // expo dev
  process.env.WEB_URL! || "https://dailyping.vercel.app", // production web URL
];
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true, // CRITICAL for cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/auth", authRouter);
app.use("/teams", requireAuth, teamRouter);
app.use("/standups", requireAuth, standupRouter);
app.use("/blockers", requireAuth, blockerRouter);
app.use("/discussions",requireAuth, discussionRouter);

app.use(errorHandler);

app.listen(process.env.PORT || 4000, () => {
  console.log("Its working");
});
