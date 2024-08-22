import { IConversation } from "../../../models/conversationModel";
import { Doctor } from "../../../models/doctorModel";
import { IMessage } from "../../../models/messageModel";
import { Patient } from "../../../models/patientModel";
export interface ImessageService{
    conversationPatients(id:string):Promise<Doctor[]|null>
    conversationDoctors(id:string):Promise<Patient[]|null>
    getMessages(id:string,senderId:string):Promise<IConversation|null>
    sendMessage(id:string,senderId:string,message:string,files: { [fieldname: string]: Express.Multer.File[]}):Promise<IMessage|null>

}