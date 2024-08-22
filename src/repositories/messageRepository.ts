import { ImessageRepository } from "./interfaces/ImessageRepository";
import Conversation, { IConversation } from "../models/conversationModel";
import Message, { IMessage } from "../models/messageModel";
import Booking from "../models/bookingModel";
import Patients,{ Patient } from "../models/patientModel";
import Doctors,{ Doctor } from "../models/doctorModel";
import { getReceiverSocketId,io } from "../Socket/socket";
import { Types,Document  } from 'mongoose';
import { log } from "console";




export default class messageRepository implements ImessageRepository{
    async conversationDoctors(id: string): Promise<Patient[]|null> {
        try {
            const bookings=await Booking.find({doctorId:id,status:{$ne:"Cancelled"}})
            const patientIds=bookings.map((booking)=>booking.patientId)
            const patients=await Patients.find({_id:{$in:patientIds}}).sort({_id:-1})
            return patients
        } catch (error) {
            throw error
        }
    }
    async  conversationPatients(id: string): Promise<Doctor[]|null> {
        try {
            const bookings= await Booking.find({patientId:id,status:{$ne:'Cancelled'}})
            const doctorIds=bookings.map((booking)=>booking.doctorId)
            const doctors=await Doctors.find({_id:{$in:doctorIds}})
            return doctors
        } catch (error) {
            throw error
        }
    }
    async getMessages(id: string, senderId: string): Promise<IConversation | null> {
        try {
            const conversation=await Conversation.findOne({participants:{$all:[senderId,id]}}).populate("messages")
            return conversation
        } catch (error) {
            throw error
        }
    }
    async sendMessage(
        id: string, 
        senderId: string, 
        message: string, 
        messageType: 'text' | 'image' | 'voice'
    ): Promise<IMessage | null> {
        try {
            const receiverId=id
            const newMessage = new Message({
                senderId,
                receiverId:id,
                messageType,
                message,
            });
    
            let conversation = await Conversation.findOne({
                participants: { $all: [senderId, receiverId] },
            });
    
            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [senderId, receiverId]
                });
            }
    
            conversation.messages.push(newMessage._id as Types.ObjectId);
    
            await Promise.all([conversation.save(), newMessage.save()]);
    
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
    
            return newMessage;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    
}