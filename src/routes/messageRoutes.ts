import { Router } from "express";
import messageController from "../controllers/messageController";
import multer from "multer";
import storage from "../util/voicemessageConfig";
const upload=multer({storage:storage})

const router=Router()
const MessageController=new messageController()

router.get('/conversations',MessageController.conversations.bind(MessageController))
router.post('/:id/:senderId',MessageController.getMessages.bind(MessageController))
router.post('/send/:id/:senderId',upload.fields([{ name: 'voiceMessage', maxCount: 1 }, { name: 'image', maxCount: 1 }]),MessageController.sendMessage.bind(MessageController))



export const messageRoutes = router;