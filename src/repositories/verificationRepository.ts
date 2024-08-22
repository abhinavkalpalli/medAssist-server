import { IverificationRepository } from "./interfaces/IverificationRepository";
import  Patients,{Patient}  from "../models/patientModel";
import Doctors, { Doctor } from "../models/doctorModel";
import Admins,{Admin} from '../models/adminModel'


export default class verificatioRepository implements IverificationRepository {
    async otpverify(email: string): Promise<Patient|null> {
        try{
        return await Patients.findOne({email}).exec() 
        }catch(error){
            throw error
        }
    }
    async otpverifydoctor(email: string): Promise<Patient|null> {
        try{
        return await Doctors.findOne({email}).exec() 
        }catch(error){
            throw error
        }
    }
    async otpverifyadmin(email: string): Promise<Admin | null> {
        try{
            return await Admins.findOne({email}).exec()
        }catch(error){
            throw error
        }
    }
    async resetpassord(email: string): Promise<Patient | null> {
        try{
            return await Patients.findOne({email}).exec()
        }catch(err){
            throw err
        }
    }
    async doctorresetpassord(email: string): Promise<Doctor | null> {
        try{
            return await Doctors.findOne({email}).exec()
        }catch(err){
            throw err
        }
    }
    async patientLogin(email: string): Promise<Patient | null> {
        try{
            return await Patients.findOne({email}).exec()
        }catch(err){
            throw err
        }
    }
    async doctorLogin(email: string): Promise<Doctor | null> {
        try{
            return await Doctors.findOne({email}).populate({path:'expertise'}).exec()
        }catch(err){
            throw err
        }
    }
    async adminLogin(email: string): Promise<Admin | null> {
        try{
            return await Admins.findOne({email}).exec()
        }catch(err){
            throw err
        }
    }
}