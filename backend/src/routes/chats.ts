import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getChats,
  createChat,
  getChat,
  deleteChat,
  renameChat,
} from '../controllers/chatController';

const router = Router();

router.use(authMiddleware);

router.get('/', getChats);
router.post('/', createChat);
router.get('/:id', getChat);
router.delete('/:id', deleteChat);
router.put('/:id', renameChat);

export default router;
