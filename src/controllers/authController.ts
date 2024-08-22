import { Request, Response, NextFunction } from "express";
import { IadminController } from "./interfaces/IadminController";
import { IauthController } from "./interfaces/IauthController";


export default class authController implements IauthController{
    patientAuth(req: Request, res: Response, next: NextFunction) {
        try{
            const user=req.user
            res.status(200).json({
                status:200,message:'User is authenticated',valid:true,user
            })
        }catch(err){
            res
            .status(200)
            .json({
              status: 500,
              message: "Somethings is wrong",
              error_code: "INTERNAL_SERVER_ERROR",
            });
        }
    }
    adminAuth(req: Request, res: Response, next: NextFunction): void {
        try{
            const user=req.user
            res.status(200).json({
                status:200,message:'User is authenticated',valid:true,user
            })
        }catch(err){
            res
            .status(200)
            .json({
              status: 500,
              message: "Somethings is wrong",
              error_code: "INTERNAL_SERVER_ERROR",
            });
        }
    }
    doctorAuth(req: Request, res: Response, next: NextFunction): void {
        try{
            const user=req.user
            res.status(200).json({
                status:200,message:'User is authenticated',valid:true,user
            })
        }catch(err){
            res
            .status(200)
            .json({
              status: 500,
              message: "Somethings is wrong",
              error_code: "INTERNAL_SERVER_ERROR",
            });
        }
    }
}