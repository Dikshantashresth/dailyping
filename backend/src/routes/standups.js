import express from "express";
import { getTodaysStandup, history, missingStandups, submitStandup, userHistory, } from "../controller/standup.controller";
import { requireRole } from "../middleware/RoleMiddleware";
import { checkSchedule } from "../middleware/scheduleMiddleware";
const router = express.Router();
// Apply requireRole only to routes that have :teamId as the first/main param
router.post("/:teamId", requireRole(["admin", "member"]), checkSchedule, submitStandup);
router.get("/today/:teamId", requireRole(["admin", "member"]), getTodaysStandup);
router.get("/history/:teamId/:date", requireRole(["admin", "member"]), history);
router.get("/user/:userId/:teamId", requireRole(["admin", "member"]), userHistory);
router.get("/missing/:teamId", requireRole(["admin", "member"]), missingStandups);
export default router;
//# sourceMappingURL=standups.js.map