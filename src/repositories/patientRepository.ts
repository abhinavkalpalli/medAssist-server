import path from "path";
import Booking, { BookingAndSlots, IBooking } from "../models/bookingModel";
import Patients, { Patient } from "../models/patientModel";
import Slots from "../models/slotModel";
import { IpatientRepository } from "./interfaces/IpatientRepository";
import Doctors from '../models/doctorModel'

export default class PatientRepository implements IpatientRepository {
    async signupPatient(userData: Partial<Patient>): Promise<Patient | null> {
        try {
            if(userData.photo){
                const data=await Patients.findOne({email:userData.email})
                if(data){
                    return null
                }
                    return await Patients.create(userData)   
            }
            const data=await Patients.findOne({email:userData.email})
            if(data){
                return null
            }
            return await Patients.create(userData);
        }catch(err){
            throw err
        }
    }
    async patientFetch(): Promise<Patient[] | null> {
        try{
            return await Patients.find().select('-password')
        }catch(err){
            throw err
        }
    }
    async fetchPatient(id: string): Promise<Patient | null> {
        try{
            return await Patients.findOne({_id:id}).select('-password')
        }catch(err){
            throw err
        }
    }
    async singlePatient(userData: Partial<Patient>): Promise<Patient | null> {
        try{
            return await Patients.findOne({email:userData.email}).exec()
        }catch(err){
            throw err
        }
    }
    async bookings(doctorId: string): Promise<BookingAndSlots | null> {
        try{
            let currentDay=new Date()
            const List=await Booking.find({doctorId:doctorId,date:{$gte:currentDay},status:'Active'})
            const Slot=await Slots.find({doctorId:doctorId,date:{$gte:currentDay}})
            return {List,Slot}
        }catch(err){
            throw err
        }
    }
    async postbookings(userData: Partial<IBooking>): Promise<IBooking | null> {
        try {
            const doctor = await Doctors.findById(userData.doctorId);
            const patient = await Patients.findById(userData.patientId);
            if (doctor && userData.Fee !== undefined) {
                if (doctor.Wallet === undefined) {
                    doctor.Wallet = 0;
                }
                doctor.Wallet += userData.Fee;
                doctor.WalletHistory.push({
                    date: new Date(),
                    amount: userData.Fee,
                    message: `Booking fee received from ${patient?.name}`,
                });
    
                await doctor.save();
            } else {
                // Handle cases where doctor or userData.Fee is undefined
                console.error("Doctor or fee is not defined.");
                throw new Error("Doctor or fee is not defined.");
            }
    
            if (patient) {
                // Ensure patient.Wallet is defined
                if (patient.Wallet === undefined) {
                    patient.Wallet = 0;
                }
    
                // Ensure doctor.Fee is defined before performing operations
                const fee = doctor?.Fee || 0;
                if(patient.Wallet===0){
                    patient.Wallet=0
                }else if (patient.Wallet >= fee) {
                    patient.Wallet -= fee;
                    patient.WalletHistory.push({
                        date: new Date(),
                        amount: -fee,
                        message: "Booking fee deducted",
                    });
                } else {
                    // Deduct the entire wallet amount if less than the fee
                    patient.WalletHistory.push({
                        date: new Date(),
                        amount: -patient.Wallet,
                        message: "Booking fee deducted",
                    });
                    patient.Wallet = 0;
                }
    
                await patient.save(); 
            } else {
                console.error("Patient not found.");
                throw new Error("Patient not found.");
            }
            return await Booking.create(userData);
        } catch (err) {
            console.error("Error in postbookings:", err);
            throw err; 
        }
    }
    
    async yourBooking(patientId: string): Promise<IBooking[] | null> {
        try{
            return await Booking.find({patientId:patientId}).populate({path:'doctorId', populate: {
                path: 'expertise', 
              },}).sort({updatedAt:-1})
        }catch(err){
            throw err
        }
    }
    async findAppointmentsAndCancel(id: string): Promise<IBooking | null> {
        try {
            const booking= await Booking.findOne({_id:id})
            const fee=booking?.Fee
            const doctor=await Doctors.findById(booking?.doctorId)
            if (doctor && fee !== undefined) {
                if (doctor.Wallet === undefined) {
                    doctor.Wallet = 0; 
                }
                doctor.Wallet -= fee;
                doctor.WalletHistory.push({
                    date: new Date(),
                    amount: -fee,
                    message: `Booking Cancelled for bookingId ${booking?._id}`
                });
                doctor.save()
            }
            const patient=await Patients.findById(booking?.patientId)
            if(patient && fee){
                if(patient.Wallet === undefined){
                    patient.Wallet=0
                }
                patient.Wallet+=fee
                patient.WalletHistory.push({
                    date:new Date(),
                    amount:fee,
                    message:`Refund of Booking that you have cancelled with bookingId ${booking._id}`
                })
                patient.save()
            }
            return booking
        } catch (err) {
            throw err
        }
    }
}
