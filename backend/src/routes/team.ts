import express from "express";
import {
  createTeam,
  getMembers,
  getTeams,
  joinTeam,
  leaveteam,
  removeMember,
  RemoveTeam,
  updateSettings,
} from "../controller/team.controller";
import { requireRole } from "../middleware/RoleMiddleware";
import { requireAuth } from "../middleware/authmiddleware";

const router = express.Router();

router.post("/", createTeam);
router.get("/getteams", getTeams);
router.post("/:id/join", joinTeam);

router.get("/:teamId/members", requireRole(["admin", "member"]), getMembers);
router.delete("/:teamId/remove/:userid",requireRole(["admin","member"]),removeMember);
router.patch("/:teamId/settings", requireRole(["admin"]), updateSettings);
router.delete("/:teamId/delete",requireRole(['admin',"member"]),RemoveTeam)
router.delete("/:teamId/leave", requireRole(["admin", "member"]), leaveteam);

export default router;
