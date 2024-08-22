import { IMessage } from "../../models/messageModel";
import { IConversation } from "../../models/conversationModel";
import { Patient } from "../../models/patientModel";
import { Doctor } from "../../models/doctorModel";

export interface ImessageRepository{
    conversationPatients(id:string):Promise<Doctor[]|null>
    conversationDoctors(id:string):Promise<Patient[]|null>
    getMessages(id:string,senderId:string):Promise<IConversation|null>
    sendMessage(id:string,senderId:string,message:string,messageType: 'text' | 'image' | 'voice'):Promise<IMessage|null>
}