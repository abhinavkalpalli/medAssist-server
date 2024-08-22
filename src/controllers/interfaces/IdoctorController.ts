import { NextFunction,Request,Response } from "express";

export interface IdoctorController{
    signupDoctor(req:Request,res:Response,next:NextFunction):void
    editDoctor(req:Request,res:Response,next:NextFunction):void
    uploadDocuments(req:Request,res:Response,next:NextFunction):void
    deleteDocument(req:Request,res:Response,next:NextFunction):void
    slotUpdate(req:Request,res:Response,next:NextFunction):void
    slotUpdateDay(req:Request,res:Response,next:NextFunction):void
    fetchSlots(req:Request,res:Response,next:NextFunction):void
    appointments(req:Request,res:Response,next:NextFunction):void
    postPrescription(req:Request,res:Response,next:NextFunction):void
    fetchDoctor(req:Request,res:Response,next:NextFunction):void
    patientHistory(req:Request,res:Response,next:NextFunction):void
    allAppointments(req:Request,res:Response,next:NextFunction):void
    updateBooking(req:Request,res:Response,next:NextFunction):void
}