import { NextFunction,Request,Response } from "express";

export interface IadminController{
    signupAdmin(req:Request,res:Response,next:NextFunction):void
    patients(req:Request,res:Response,next:NextFunction):void
    doctors(req:Request,res:Response,next:NextFunction):void
    blockUnblockDoctor(req:Request,res:Response,next:NextFunction):void
    blockUnblockPatient(req:Request,res:Response,next:NextFunction):void
    documentsVerify(req:Request,res:Response,next:NextFunction):void
    bookingList(req:Request,res:Response,next:NextFunction):void
    bookings(req:Request,res:Response,next:NextFunction):void
    updateFee(req:Request,res:Response,next:NextFunction):void
    addExpertise(req:Request,res:Response,next:NextFunction):void
    expertise(req:Request,res:Response,next:NextFunction):void
    editExpertise(req:Request,res:Response,next:NextFunction):void

}