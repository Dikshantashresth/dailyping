import express from 'express';
import { requireRole } from '../middleware/RoleMiddleware';
import { getBlockers, resolveBlocker } from '../controller/blockers.controller';
const router = express.Router();
router.get('/:teamId', requireRole(["admin", 'member']), getBlockers);
router.patch("/resolve/:teamId/:blockerId", requireRole(["admin", "member"]), resolveBlocker);
export default router;
//# sourceMappingURL=blockers.js.map