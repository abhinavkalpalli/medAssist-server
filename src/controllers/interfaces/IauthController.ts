import { NextFunction,Request,Response } from "express";

export interface IauthController{
    patientAuth(req:Request,res:Response,next:NextFunction):void
    adminAuth(req:Request,res:Response,next:NextFunction):void
    doctorAuth(req:Request,res:Response,next:NextFunction):void
}