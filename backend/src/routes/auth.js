import express from 'express';
import { login, logout, register, getMe } from '../controller/auth.controller';
import { requireAuth } from '../middleware/authmiddleware';
import limiter from '../middleware/generallimitter';
const router = express.Router();
router.post('/login', limiter, login);
router.post('/sign-up', register);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
export default router;
//# sourceMappingURL=auth.js.map