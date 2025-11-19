import { Router } from 'express';
import { vapiConversationEndHandler } from '../controllers/webhook.controller';

const router = Router();

// Vapi webhook endpoint
router.post('/vapi/conversation-end', vapiConversationEndHandler);

export default router;
