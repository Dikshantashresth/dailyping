import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorhandler";
import authRouter from "./routes/auth";
import teamRouter from "./routes/team";
import standupRouter from "./routes/standups";
import cors from 'cors';
import { requireAuth } from "./middleware/authmiddleware";
import blockerRouter from "./routes/blockers";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use('/auth', authRouter);
app.use('/teams', requireAuth, teamRouter);
app.use('/standups', requireAuth, standupRouter);
app.use('/blockers', requireAuth, blockerRouter);
app.use(errorHandler);
app.listen(process.env.PORT || 4000, () => {
    console.log("Its working");
});
//# sourceMappingURL=index.js.map