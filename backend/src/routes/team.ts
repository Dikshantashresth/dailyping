import express from "express";
import {
  createTeam,
  getMembers,
  getTeams,
  joinTeam,
  leaveteam,
  updateSettings,
} from "../controller/team.controller";
import { requireRole } from "../middleware/RoleMiddleware";

const router = express.Router();

router.post("/", createTeam);
router.get("/getteams", getTeams);
router.post("/:id/join", joinTeam);

router.get("/:teamId/members", requireRole(["admin", "member"]), getMembers);
router.patch("/:teamId/settings", requireRole(["admin"]), updateSettings);
router.delete("/:teamId/leave", requireRole(["admin", "member"]), leaveteam);

export default router;
