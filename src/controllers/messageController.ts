import { Request, Response, NextFunction } from "express";
import { ImessageController } from "./interfaces/ImessageController";
import messageService from "../services/message/messageService";

export default class messageController implements ImessageController{
    private _messageService:messageService
    constructor(){
        this._messageService=new messageService()
    }
    async sendMessage(req: Request, res: Response, next: NextFunction){
        try {
            const {message}=req.body
            let {id,senderId}=req.params
            const files = req.files as { [fieldname: string]: Express.Multer.File[] }; 
            const data=await this._messageService.sendMessage(id,senderId,message,files)
            return res.status(200).json({newMessage:data})
        } catch (error) {
            throw error
        }
    }
    async conversations(req: Request, res: Response, next: NextFunction){
        try {
            const {id,action}=req.query
        let conversation
        if(action==='fetchDoctorForUsers'){
            conversation= await this._messageService.conversationPatients(id as string)
            return res.json({conversation})
        }else if(action==="fetchUsersForDoctor"){
            conversation=await this._messageService.conversationDoctors(id as string)
            return res.json({conversation})
        }
        } catch (error) {
            throw error
        }
        
    }
    async getMessages(req: Request, res: Response, next: NextFunction){
        try {
             const {id:userToChatId,senderId}=req.params
             const conversation=await this._messageService.getMessages(userToChatId as string, senderId as string)
             if(conversation?.messages){
             return res.status(200).json({messages:conversation.messages})
             }else{
                return res.status(200).json([])
             }
        } catch (error) {
            throw error
        }
    }
}