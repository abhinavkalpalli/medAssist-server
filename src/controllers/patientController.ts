
import { IpatientController } from "./interfaces/IpatientController";
import { Request,Response,NextFunction } from "express";
import patientService from "../services/patient/patientService";
import VerificationService from "../services/patient/verificationService";
import bcrypt from 'bcrypt'
import generateJwt from "../middleware/jwt";
import { DoctorQuery } from "../models/doctorModel";
import Razorpay from "razorpay";
import dotenv from 'dotenv'
import crypto from 'crypto';
import { join } from 'path';
import mongoose from "mongoose";
dotenv.config();



export default class patientController implements IpatientController{
    private _patientService:patientService
    private _verificationService:VerificationService
    constructor(){
        this._patientService=new patientService()
        this._verificationService=new VerificationService()
    }
    async signupPatient(req: Request, res: Response, next: NextFunction) {
        try{
            const {name,email,address,phone,gender,state,pincode,country,password,photo,is_Verified}=req.body
            if(photo){
            const data={name,email,photo,is_Verified}
            const userData=await this._patientService.signupPatient(data)
            let tokens=await generateJwt({_id:userData?._id as string,email:userData?.email})
            if(userData===null){
                const existingUser=await this._verificationService.singlePatient(email)
                if(!existingUser?.is_Blocked){
                let tokens=await generateJwt({_id:existingUser?._id as string,email:existingUser?.email})
                    return res.status(201).json({message:'GoolgeAuth',email,photo:existingUser?.photo,name:existingUser?.name,is_Blocked:existingUser?.is_Blocked,_id:existingUser?._id,Wallet:existingUser?.Wallet,WalletHistory:existingUser?.WalletHistory,favourite_doctors:existingUser?.favourite_doctors,tokens})
                }else{
                    return res.status(403).json({message:'User is blocked'})
                }
            }else{
                if(!userData?.is_Blocked){
                    return res.status(201).json({
                        message: "Google signup registered",
                        email,photo:userData?.photo,name:userData?.name,is_Blocked:userData?.is_Blocked,_id:userData?._id,Wallet:userData?.Wallet,WalletHistory:userData.WalletHistory,favourite_doctors:userData.favourite_doctors,tokens});
            }else{
                res.status(403).json({message:'User is blocked'})
            }
            }
            }else{
                const hashedPassword=await bcrypt.hash(password,10)
                const data={name,email,address,phone,gender,state,pincode,country,password:hashedPassword,photo}
                const userData=await this._patientService.signupPatient(data)
                if(userData===null){
                    return res.status(400).json({message:'User Exists'})
                }
                const otp = this._verificationService.generateOtp();
                await this._verificationService.SendOtpEmail(email, 'Your OTP Code', otp);
                return res.status(201).json({
                    message: "Patient registered successfully and OTP sent",
                    email,
                    otp,
                    photo,
                    name
                });
            }
           
        }catch(error){
            next(error)
        }      
    }
    async editPatient(req: Request, res: Response, next: NextFunction) {
        try{
            const {name,email,photo}=req.body
            const userData={name,email,photo}
            const data= await this._patientService.editPatient(userData)
            return res.status(200).json({message:'Profile Updated',name,email,photo})
        }catch(err){
            throw err
        }
    }
    async doctors(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit, experience, gender,expertise } = req.query;  
            let query: DoctorQuery = {
              is_Verified: true,
              is_Blocked: false,
              documents_verified: true,
              experienceYears: experience ? parseInt(experience as string) : undefined,
              gender: gender as string,
              expertise: typeof expertise === 'string' ? expertise : undefined,
            }
            const data = await this._patientService.doctors(query,parseInt(page as string),parseInt(limit as string));
            return res.status(200).json({ data });
          } catch (err) {
            next(err);
          }
    }
    async getbookings(req: Request, res: Response, next: NextFunction) {
        try{
            const {doctorId}=req.query 
            const data=await this._patientService.bookings(doctorId as string)
            return res.status(200).json({List:data?.List,Slots:data?.Slot})
        }catch(err){
            throw err
        }
    }
    async postBooking(req: Request, res: Response, next: NextFunction) {
        try{
            const {doctorId,patientId,shift,date,Fee}=req.body
            const UserData={doctorId,patientId,shift,date,Fee}
            const data=await this._patientService.postbookings(UserData)
            return res.status(200).json({message:'Booked',data})
        }catch(err){
            throw err
        }
    }
    async yourBooking(req: Request, res: Response, next: NextFunction) {
        try{
            const {patientId}=req.params
            const data=await this._patientService.yourBooking(patientId as string)
            return res.status(200).json({message:'Appointments',data})
        }catch(err){

        }
    }
    async cancelAppointment(req: Request, res: Response, next: NextFunction) {
        try{
            const {id}=req.params
            const data=await this._patientService.cancelAppointment(id as string)
            if(data){
                return res.status(200).json({message:'Appointment Cancelled'})
            }else{
                return res.status(500).json({message:'Internal error'})
            }
        }catch(err){
            throw err
        }
    }
    async createPayment(req: Request, res: Response, next: NextFunction){
        try{
            const razorpayInstance = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID||'',
                key_secret: process.env.RAZORPAY_KEY_SECRET,
              })
                  const { Fee} = req.body;
                  const amount = Fee*100; 
            
                  const options = {
                    amount: amount,
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`,
                    payment_capture: 1,
                  };
              
                  const order = await razorpayInstance.orders.create(options);
              
                  return res.status(200).json({
                    success: true,
                    order,
                  });
                  
        }catch(err){
            throw err
        }
    }
    async verifyPayment(req: Request, res: Response, next: NextFunction) {
            try {
              const { response, order } = req.body;
              const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
          
              const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET||'');
              hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
              const generatedSignature = hmac.digest('hex');
          
              if (generatedSignature === razorpay_signature) {
                res.status(200).json({ success: true, paid: true });
              } else {
                res.status(400).json({ success: false, paid: false, message: 'Invalid Signature' });
              }
            } catch (error) {
              console.error('Error verifying payment:', error);
              res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
          
    }
    async fetchpatient(req: Request, res: Response, next: NextFunction) {
        try{
            const {patientId}=req.query
            let id=patientId
            const data=await this._patientService.fetchpatient(id as string)
            if(data){
                return res.status(200).json({patient:data})
            }
        }catch(err){
            throw err
        }
    }
    async setFavourite(req: Request, res: Response, next: NextFunction){
        try{
            const {id,doctorId,status}=req.body
            const data=await this._patientService.setFavourite(id as string,doctorId as string,status as boolean)
            return res.status(200).json({message:'Updated Favourite List',favourite_doctors:data?.favourite_doctors})
        }catch(err){
            throw err
        }
    }
    async postRating(req: Request, res: Response, next: NextFunction){
        try{
            const {doctorId,patientId,rating}=req.body
            const data=await this._patientService.postRating(doctorId,patientId,rating)
            if(data){
                return res.status(200).json({message:'Rating submitted'})
            }else{
                return res.status(500).json({message:'Internal Server Error'})
            }
        }catch(err){
            throw err
        }
    }
}