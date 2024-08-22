
import Doctors, { Doctor, DoctorQuery } from "../models/doctorModel";
import { IdoctorRepository, PaginatedDoctors } from "./interfaces/IdoctorRepository";
import Slots,{ ISlot, ISlotData } from "../models/slotModel";
import Booking, { IBooking } from "../models/bookingModel";
import mongoose, { Types } from 'mongoose';


export default class doctorRepository implements IdoctorRepository {
    async signupDoctor(userData: Partial<Doctor>): Promise<Doctor | null> {
        try {
            let user=await Doctors.findOne({email:userData.email})
            if(user){
                return null
            }
            return await Doctors.create(userData);
        }catch(err){
            throw err
        }
    }
    async doctorFetch(): Promise<Doctor[] | null> {
        try{
            return await Doctors.find().select('-password').populate({path:'expertise'})
        }catch(err){
            throw err
        }
    }
    async fetchDoctor(id: string): Promise<Doctor | null> {
        try{
            return await Doctors.findOne({_id:id}).select('-password').populate({path:'expertise'})
        }catch(err){
            throw err
        }
    }
    async singleDoctor(userData: Partial<Doctor>): Promise<Doctor | null> {
        try{
            return await Doctors.findOne({email:userData.email}).select('-password').populate({path:'expertise'})
        }catch(err){
            throw err
        }
    }
    async slotUpdate(slotData: ISlotData): Promise<boolean> {
      try {
        const { doctorId, startDate, endDate, startTime, endTime, duration, breakTime } = slotData;
    
      
        const doctorObjectId = new Types.ObjectId(doctorId);
    
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        let currentDate = new Date(start);
    
        
        const startTimeDate = new Date(`1970-01-01T${startTime}`);
        const endTimeDate = new Date(`1970-01-01T${endTime}`);
    
        
        let operations = [];
    
        while (currentDate <= end) {
          const daySlots: string[] = [];
    
        
          let shiftStart = new Date(currentDate);
          shiftStart.setHours(startTimeDate.getHours(), startTimeDate.getMinutes(), 0, 0);
    
          const shiftEnd = new Date(currentDate);
          shiftEnd.setHours(endTimeDate.getHours(), endTimeDate.getMinutes(), 0, 0);
    
          
          while (shiftStart < shiftEnd) {
            const shiftEndTime = new Date(shiftStart.getTime() + duration * 60000);
    
            if (shiftEndTime > shiftEnd) break;
    
      
            const shiftStartFormatted = shiftStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            const shiftEndFormatted = shiftEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    
            
            daySlots.push(`${shiftStartFormatted} - ${shiftEndFormatted}`);
    
    
            shiftStart = new Date(shiftEndTime.getTime() + breakTime * 60000);
          }
    
        
          operations.push({
            updateOne: {
              filter: { doctorId: doctorObjectId, date: new Date(currentDate.setUTCHours(0, 0, 0, 0)) },
              update: { doctorId: doctorObjectId, date: new Date(currentDate.setUTCHours(0, 0, 0, 0)), shifts: daySlots, createdAt: new Date() },
              upsert: true
            }
          });
    
        
          currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        }
    
      
        const result = await Slots.bulkWrite(operations);
    
        return result.modifiedCount > 0 || result.upsertedCount > 0;
    
      } catch (err) {
          console.error('Error in slotUpdate:', err);
          throw err;
        }
      }
      
      async fetchSlots(id: string, date: string): Promise<ISlot | null> {
        try {
          
          const inputDate = new Date(date);
      
          const year = inputDate.getUTCFullYear();
          const month = String(inputDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
          const day = String(inputDate.getUTCDate()).padStart(2, '0');
          const hours = String(inputDate.getUTCHours()).padStart(2, '0');
          const minutes = String(inputDate.getUTCMinutes()).padStart(2, '0');
          const seconds = String(inputDate.getUTCSeconds()).padStart(2, '0');
          const milliseconds = String(inputDate.getUTCMilliseconds()).padStart(3, '0');

  
    const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+00:00`;
          
      
        
          const slots = await Slots.findOne({ doctorId: id, date: isoDateString })
          
          if (slots) {
            return slots;
          } else {
            return null;
          }
        } catch (error) {
          throw new Error('Error fetching slots');
        }
      }      
        async fetchDoctorsForPatient(query: DoctorQuery, page: number, limit: number): Promise<PaginatedDoctors | null> {
            try {
              let mongoQuery: any = {
                is_Verified: query.is_Verified,
                is_Blocked: query.is_Blocked,
                documents_verified: query.documents_verified
              };
              
              if (query.experienceYears) {
                mongoQuery.experienceYears = { $gte: query.experienceYears };
              }
              if (query.gender) mongoQuery.gender = query.gender;
              if (query.expertise) {
                mongoQuery.expertise = query.expertise;
            }
              
              const doctors = await Doctors.find(mongoQuery).populate({path:'expertise'})
                .limit(limit)
                .skip((page - 1) * limit)
                .exec();
              const count = await Doctors.countDocuments(mongoQuery);
              return { doctors, totalPages: Math.ceil(count / limit), currentPage: page };
            } catch (err) {
              throw new Error("Error getting list.");
            }
          }
              
    
    async appointments(doctorId: string, date: string): Promise<IBooking[] | null> {
        try{
            const inputDate = new Date(date);
            const isoDateString = inputDate.toISOString().split("T")[0];
            return await Booking.find({doctorId:doctorId,date:isoDateString}).populate({path:'patientId'})
        }catch(err){
            throw err
        }
    }
    async fetchAppointment(id: string): Promise<IBooking | null> {
        try{
            return await Booking.findById(id).exec()
        }catch(err){
            throw err
        }
    }
    async patientHistory(patientId: string, doctorId: string): Promise<IBooking[] | null> {
        try {
            return await Booking.find({patientId,doctorId,status:'Completed'})
        } catch (error) {
            throw error
        }
    }
    async allAppointments(doctorId: string): Promise<IBooking[] | null> {
        try{
            return await Booking.find({doctorId:doctorId}).populate({path:'patientId'})
        }catch(err){
            throw err
        }
    }
    async slotUpdateDay(doctorId: string, date: string, slots: string[]): Promise<ISlot|null> {
      try{
        return await Slots.findOneAndUpdate({doctorId,date:date},{$set:{shifts:slots}})
      }catch(err){
        throw err
      }
    }
}