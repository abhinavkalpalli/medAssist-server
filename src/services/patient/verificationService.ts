// src/services/patient/verificationService.ts
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import { IverificationService } from './interfaces/IverificationService';
import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { Patient } from '../../models/patientModel';
import { Doctor } from '../../models/doctorModel';
import verificatioRepository from '../../repositories/verificationRepository';
import { Admin } from '../../models/adminModel';
import { error } from 'console';
dotenv.config();




export default class VerificationService implements IverificationService{
  private _verificationRepository:verificatioRepository
  constructor(){
    this._verificationRepository=new verificatioRepository()
  }
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.PASS,
    },
  });
  async resetpassword(email: string, hashedpassword: string): Promise<Patient | null> {
    try{
      const userData=await this._verificationRepository.resetpassord(email)
      if(userData){
        userData.password=hashedpassword
        await userData.save()
        return userData
      } else{
        return null
      }
    }catch(err){
      throw err
    }
  }
  async optverify(email: string): Promise<Patient | null> {
      try{
        const userData=await this._verificationRepository.otpverify(email)
        if(userData){
          userData.is_Verified=true
          await userData.save()
          return userData
        }else{
          return null
        }
      }catch(err){
        throw err
      }
  }
  async optverifydoctor(email: string): Promise<Patient | null> {
    try{
      const userData=await this._verificationRepository.otpverifydoctor(email)
      if(userData){
        userData.is_Verified=true
        await userData.save()
        return userData
      }else{
        return null
      }
    }catch(err){
      throw err
    }
}
async adminotpverify(email: string): Promise<Admin | null> {
  try{
    const userData=await this._verificationRepository.otpverifyadmin(email)
    if(userData){
      userData.is_Verified=true
      await userData.save()
      return userData
    }else{
      return null
    }
  }catch(err){
    throw err
  }
}
async doctorresetpassword(email: string, hashedpassword: string): Promise<Doctor | null> {
  try{
    const userData=await this._verificationRepository.doctorresetpassord(email)
    
    if(userData){
      userData.password=hashedpassword
      await userData.save()      
      return userData
    } else{
      return null
    }
  }catch(err){
    throw err
  }
}
async adminresetpassword(email: string, hashedpassword: string): Promise<Admin | null> {
  try{
    const userData=await this._verificationRepository.adminLogin(email)
    
    if(userData){
      userData.password=hashedpassword
      await userData.save()      
      return userData
    } else{
      return null
    }
  }catch(err){
    throw err
  }
}
async patientlogin(email: string): Promise<Patient | null> {
  try{
    const userData=await this._verificationRepository.patientLogin(email)
    return userData
  }catch(err){
    throw err
  }
}
async doctorlogin(email: string): Promise<Doctor | null> {
  try{
    const userData=await this._verificationRepository.doctorLogin(email)
    return userData
  }catch(err){
    throw err
  }
}
async adminlogin(email: string): Promise<Admin | null> {
  try{
    const userData=await this._verificationRepository.adminLogin(email)
    return userData
  }catch(err){
    throw err
  }
}
  public async SendOtpEmail(to: string, subject: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.USER_MAIL!,
      to,
      subject,
      text: `Your OTP code is ${otp}`,
      html: `<p>Your OTP code is <strong>${otp}</strong></p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending OTP Email:', error);
      throw new Error('Failed to send OTP Email');
    }
  }
  async singlePatient(email: string): Promise<Patient | null> {
    try{
        return await this._verificationRepository.patientLogin(email)
    }catch{
      throw error
    }
  }
  public generateOtp(): string {
    return otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
  }
}
