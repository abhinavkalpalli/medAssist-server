import { Request, Response, NextFunction } from "express";
import { IauthController } from "./interfaces/IauthController";

export default class authController implements IauthController {
  async patientAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      res.status(200).json({
        status: 200,
        message: "User is authenticated",
        valid: true,
        user,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Somethings is wrong",
        error_code: "INTERNAL_SERVER_ERROR",
      });
    }
  }
  async adminAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      res.status(200).json({
        status: 200,
        message: "User is authenticated",
        valid: true,
        user,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Somethings is wrong",
        error_code: "INTERNAL_SERVER_ERROR",
      });
    }
  }
  async doctorAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      res.status(200).json({
        status: 200,
        message: "User is authenticated",
        valid: true,
        user,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Somethings is wrong",
        error_code: "INTERNAL_SERVER_ERROR",
      });
    }
  }
}
