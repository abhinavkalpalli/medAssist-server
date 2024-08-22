import { NextFunction,Request,Response } from "express";

export interface IpatientController{
    signupPatient(req:Request,res:Response,next:NextFunction):void
    editPatient(req:Request,res:Response,next:NextFunction):void
    doctors(req:Request,res:Response,next:NextFunction):void
    getbookings(req:Request,res:Response,next:NextFunction):void
    postBooking(req:Request,res:Response,next:NextFunction):void
    yourBooking(req:Request,res:Response,next:NextFunction):void
    cancelAppointment(req:Request,res:Response,next:NextFunction):void
    createPayment(req:Request,res:Response,next:NextFunction):void
    verifyPayment(req:Request,res:Response,next:NextFunction):void
    fetchpatient(req:Request,res:Response,next:NextFunction):void
    setFavourite(req:Request,res:Response,next:NextFunction):void
    postRating(req:Request,res:Response,next:NextFunction):void
}