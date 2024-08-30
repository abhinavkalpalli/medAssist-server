import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import VerificationService from "../services/patient/verificationService";
import { IverificationController } from "./interfaces/IverificationController";
import bcrypt from "bcrypt";
import { error } from "console";
import generateJwt from "../middleware/jwt";
import { Payload } from "../middleware/jwt";

export default class verificationController implements IverificationController {
  private _verficationService: VerificationService;

  constructor() {
    this._verficationService = new VerificationService();
  }
  async otpverify(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;
      const data = await this._verficationService.optverify(email);
      if (data) {
        return res.status(200).json({ message: "verified" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async otpverifydoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const data = await this._verficationService.optverifydoctor(email);
      if (data) {
        return res.status(200).json({ message: "verified" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async adminotpverify(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const data = await this._verficationService.adminotpverify(email);
      if (data) {
        return res.status(200).json({ message: "verified" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async forgotpassword(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;
      const otp = this._verficationService.generateOtp();
      const data = await this._verficationService.SendOtpEmail(
        email,
        "This is for your forgot password",
        otp
      );
      return res.status(200).json({ message: "otp sent", email, otp });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async resetpassword(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ) {
    try {
      const { email, password, oldPassword } = req.body;
      if (oldPassword) {
        const user = await this._verficationService.patientlogin(email);
        if (user) {
          const isMatch = await bcrypt.compare(oldPassword, user?.password);
          if (isMatch) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const data = await this._verficationService.resetpassword(
              email,
              hashedPassword
            );
            return res.status(200).json({ message: "Password changed" });
          } else {
            return res
              .status(400)
              .json({ message: "Enter correct old password" });
          }
        }
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = await this._verficationService.resetpassword(
          email,
          hashedPassword
        );
        return res.status(200).json({ message: "Password changed" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async adminforgotpassword(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;
      const otp = this._verficationService.generateOtp();
      const data = await this._verficationService.SendOtpEmail(
        email,
        "This is for your forgot password",
        otp
      );
      return res
        .status(200)
        .json({ message: "otp sent", email, otp, isAdmin: true });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async adminresetpassword(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ) {
    try {
      const { email, password, oldPassword } = req.body;
      if (oldPassword) {
        const user = await this._verficationService.adminlogin(email);
        if (user) {
          const isMatch = await bcrypt.compare(oldPassword, user?.password);
          if (isMatch) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const data = await this._verficationService.adminresetpassword(
              email,
              hashedPassword
            );
            return res.status(200).json({ message: "Password changed" });
          } else {
            return res
              .status(400)
              .json({ message: "Enter correct old password" });
          }
        }
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = await this._verficationService.adminresetpassword(
          email,
          hashedPassword
        );
        return res.status(200).json({ message: "Password changed" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async doctorforgotpassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const otp = this._verficationService.generateOtp();
      const data = await this._verficationService.SendOtpEmail(
        email,
        "This is for your forgot password",
        otp
      );
      return res
        .status(200)
        .json({ message: "otp sent", email, otp, isDoctor: true });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async doctorresetpassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, oldPassword } = req.body;
      if (oldPassword) {
        const user = await this._verficationService.doctorlogin(email);
        if (user) {
          const isMatch = await bcrypt.compare(oldPassword, user?.password);
          if (isMatch) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const data = await this._verficationService.doctorresetpassword(
              email,
              hashedPassword
            );
            return res.status(200).json({ message: "Password changed" });
          } else {
            return res
              .status(400)
              .json({ message: "Enter correct old password" });
          }
        }
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = await this._verficationService.doctorresetpassword(
          email,
          hashedPassword
        );
        return res.status(200).json({ message: "Password changed" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async patientlogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const data = await this._verficationService.patientlogin(email);

      if (data) {
        const password2 = data.password;
        const isMatch = await bcrypt.compare(password, password2);

        if (isMatch) {
          const {
            name,
            photo,
            is_Blocked,
            _id,
            Wallet,
            WalletHistory,
            favourite_doctors,
          } = data;
          if (!is_Blocked) {
            let tokens = await generateJwt(data as Payload);
            return res
              .status(200)
              .json({
                message: "Patient Logged in",
                email,
                name,
                photo,
                _id: _id,
                tokens,
                Wallet,
                WalletHistory,
                favourite_doctors,
              });
          } else {
            return res.status(403).json({ message: "User is blocked" });
          }
        } else {
          return res.status(402).json({ message: "Password did not match" });
        }
      } else {
        return res.status(404).json({ message: "Patient not found" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async doctorlogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const data = await this._verficationService.doctorlogin(email);

      if (data) {
        const password2 = data.password;
        const isMatch = await bcrypt.compare(password, password2);

        if (isMatch) {
          const {
            name,
            photo,
            is_Blocked,
            is_Verified,
            dateOfBirth,
            address,
            currentWorkingHospital,
            gender,
            expertise,
            workingDays,
            phone,
            workingHospitalContact,
            experienceYears,
            documents,
            _id,
            Wallet,
            WalletHistory,
            education,
          } = data;
          if (!is_Blocked) {
            let tokens = await generateJwt(data as Payload);
            return res
              .status(200)
              .json({
                message: "Doctor Logged in",
                email,
                name,
                photo,
                is_Blocked,
                is_Verified,
                dateOfBirth,
                address,
                currentWorkingHospital,
                gender,
                expertise,
                workingDays,
                phone,
                workingHospitalContact,
                experienceYears,
                documents,
                _id,
                Wallet,
                WalletHistory,
                education,
                tokens,
              });
          } else {
            return res.status(403).json({ message: "User is blocked" });
          }
        } else {
          return res.status(402).json({ message: "Password did not match" });
        }
      } else {
        return res.status(404).json({ message: "Doctor not found" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async adminlogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const data = await this._verficationService.adminlogin(email);

      if (data) {
        const password2 = data.password;
        const isMatch = await bcrypt.compare(password, password2);
        if (isMatch) {
          const { email, baseFee, Increment, is_Verified } = data;
          let tokens = await generateJwt(data as Payload);
          return res
            .status(200)
            .json({
              message: "Admin Logged in",
              email,
              baseFee,
              Increment,
              tokens,
              is_Verified,
            });
        } else {
          return res.status(402).json({ message: "Password did not match" });
        }
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async otpresend(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.query;
      const otp = this._verficationService.generateOtp();
      const data = await this._verficationService.SendOtpEmail(
        email as string,
        "This is your new Otp",
        otp
      );
      return res.status(200).json({ message: "otp sent", otp });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
}
