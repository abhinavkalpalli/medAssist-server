import { NextFunction,Request,Response } from "express";
export  interface ImessageController{
    conversations(req:Request,res:Response,next:NextFunction):void
    getMessages(req:Request,res:Response,next:NextFunction):void
    sendMessage(req:Request,res:Response,next:NextFunction):void
}