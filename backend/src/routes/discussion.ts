import express from "express";
import { requireAuth } from "../middleware/authmiddleware";
import { requireRole } from "../middleware/RoleMiddleware";
import {
  getDiscussions,
  insertDiscussion,
  getReplies,
  insertReply,
} from "../controller/discussion.controller";

const router = express.Router();

router.get(
  "/:teamId/blockers/:blockerId/discussions",
  requireAuth,
  requireRole(["admin", "member"]),
  getDiscussions,
);

router.post(
  "/:teamId/blockers/:blockerId/discussions",
  requireAuth,
  requireRole(["admin", "member"]),
  insertDiscussion,
);

router.get(
  "/:teamId/discussions/:commentid/replies",
  requireAuth,
  requireRole(["admin", "member"]),
  getReplies,
);

router.post(
  "/:teamId/discussions/:commentid/replies",
  requireAuth,
  requireRole(["admin", "member"]),
  insertReply,
);

export default router;
