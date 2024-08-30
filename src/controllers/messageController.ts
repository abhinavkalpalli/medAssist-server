import { Request, Response, NextFunction } from "express";
import { ImessageController } from "./interfaces/ImessageController";
import messageService from "../services/message/messageService";
import {
  uploadImageToCloudinary,
  uploadVoiceMessageToCloudinary,
} from "../util/Cloudinary";
import path from "path";

export default class messageController implements ImessageController {
  private _messageService: messageService;
  constructor() {
    this._messageService = new messageService();
  }
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { message } = req.body;
      const { id, senderId } = req.params;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      let messageType: "text" | "image" | "voice" = "text";
      let messageContent: string = message;

      if (files.voiceMessage && files.voiceMessage[0]) {
        messageType = "voice";
        const voicePath = path.join(
          __dirname,
          "../public/voicemessages",
          files.voiceMessage[0].filename
        );
        messageContent = await uploadVoiceMessageToCloudinary(voicePath);
      } else if (files.image && files.image[0]) {
        messageType = "image";
        const imagePath = path.join(
          __dirname,
          "../public/images",
          files.image[0].filename
        );
        messageContent = await uploadImageToCloudinary(imagePath);
      }

      const data = await this._messageService.sendMessage(
        id,
        senderId,
        messageContent,
        messageType
      );
      return res.status(200).json({ newMessage: data });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async conversations(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, action } = req.query;
      let conversation;
      if (action === "fetchDoctorForUsers") {
        conversation = await this._messageService.conversationPatients(
          id as string
        );
        return res.json({ conversation });
      } else if (action === "fetchUsersForDoctor") {
        conversation = await this._messageService.conversationDoctors(
          id as string
        );
        return res.json({ conversation });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userToChatId, senderId } = req.params;
      const conversation = await this._messageService.getMessages(
        userToChatId as string,
        senderId as string
      );
      if (conversation?.messages) {
        return res.status(200).json({ messages: conversation.messages });
      } else {
        return res.status(200).json([]);
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
}
