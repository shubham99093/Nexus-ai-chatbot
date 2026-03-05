import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { sendMessage } from '../controllers/chatController';

const router = Router();

router.use(authMiddleware);

router.post('/', sendMessage);

export default router;
