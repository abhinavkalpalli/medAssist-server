import { IConversation } from "../../models/conversationModel";
import { Doctor } from "../../models/doctorModel";
import { IMessage } from "../../models/messageModel";
import { Patient } from "../../models/patientModel";
import messageRepository from "../../repositories/messageRepository";
import { ImessageService } from "./interfaces/ImessageService";
import dotenv from 'dotenv'
dotenv.config();

export default class messageService implements ImessageService{
    private _messageRepository:messageRepository
    constructor(){
        this._messageRepository=new messageRepository()
    }
    async conversationDoctors(id: string): Promise<Patient[]|null> {
        try {
            return await this._messageRepository.conversationDoctors(id)
        } catch (error) {
            throw error
        }
    }
    async conversationPatients(id: string): Promise<Doctor[]|null> {
        try {
            return await this._messageRepository.conversationPatients(id)
        } catch (error) {
            throw error
        }
    }
    async getMessages(id: string, senderId: string): Promise<IConversation | null> {
        try {
            return await this._messageRepository.getMessages(id,senderId)
        } catch (error) {
            throw error
        }
    }
    async sendMessage(id: string, senderId: string,message:string,files: { [fieldname: string]: Express.Multer.File[]}): Promise<IMessage | null> {
        try{
            let messageType: 'text' | 'image' | 'voice' = 'text';
            let messageContent: string = message;

            if (files.voiceMessage && files.voiceMessage[0]) {
                messageType = 'voice';
                messageContent = process.env.HOST + `/voicemessages/${files.voiceMessage[0].filename}`;
            } else if (files.image && files.image[0]) {
                messageType = 'image';
                messageContent = process.env.HOST + `/images/${files.image[0].filename}`;
            }

            return await this._messageRepository.sendMessage(id, senderId, messageContent,messageType);
        }catch(err){
            throw err
        }
    }
}