// src/interfaces/IverificationService.ts
import { Request,Response,NextFunction } from "express";
import { Patient } from "../../../models/patientModel";
import { Doctor } from "../../../models/doctorModel";
import { Admin } from "../../../models/adminModel";

export interface IverificationService {
    SendOtpEmail(to: string, subject: string, otp: string): Promise<void>;
  
    generateOtp(): string;

    optverify(email:string):Promise<Patient|null>
    optverifydoctor(email:string):Promise<Patient|null>
    adminotpverify(email:string):Promise<Admin|null>
    resetpassword(email:string,hashedpassword:string):Promise<Patient|null>
    doctorresetpassword(email:string,hashedpassword:string):Promise<Doctor|null>
    patientlogin(email:string):Promise<Patient|null>
    doctorlogin(email:string):Promise<Doctor|null>
    adminlogin(email:string):Promise<Admin|null>
    singlePatient(email:string):Promise<Patient|null>
    adminresetpassword(email:string,hashedpassword:string):Promise<Admin|null>

  }
  