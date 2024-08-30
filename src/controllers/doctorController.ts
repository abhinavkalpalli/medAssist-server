import { IdoctorController } from "./interfaces/IdoctorController";
import { Request, Response, NextFunction } from "express";
import doctorService from "../services/doctor/doctorService";
import VerificationService from "../services/patient/verificationService";
import bcrypt from "bcrypt";
import generateJwt from "../middleware/jwt";
import { ISlotData } from "../models/slotModel";

export default class doctorController implements IdoctorController {
  private _doctorService: doctorService;
  private _verificationService: VerificationService;
  constructor() {
    this._doctorService = new doctorService();
    this._verificationService = new VerificationService();
  }
  async signupDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        email,
        address,
        phone,
        gender,
        state,
        pincode,
        country,
        password,
        photo,
        is_Verified,
        expertise,
        dateOfBirth,
        languageKnown,
        currentWorkingHospital,
      } = req.body;
      if (photo) {
        const data = { name, email, photo, is_Verified };
        const userData = await this._doctorService.signupDoctor(data);
        let tokens = await generateJwt({
          _id: userData?._id as string,
          email: userData?.email,
        });
        if (userData === null) {
          const existingUser = await this._verificationService.doctorlogin(
            email
          );
          let tokens = await generateJwt({
            _id: existingUser?._id as string,
            email: existingUser?.email,
          });
          if (!existingUser?.is_Blocked) {
            return res
              .status(201)
              .json({
                message: "GoolgeAuth",
                name: existingUser?.name,
                email: existingUser?.email,
                address: existingUser?.address,
                phone: existingUser?.phone,
                gender: existingUser?.gender,
                state: existingUser?.state,
                pincode: existingUser?.pincode,
                country: existingUser?.country,
                photo: existingUser?.photo,
                is_Verified: existingUser?.is_Verified,
                expertise: existingUser?.expertise,
                dateOfBirth: existingUser?.dateOfBirth,
                currentWorkingHospital: existingUser?.currentWorkingHospital,
                workingDays: existingUser?.workingDays,
                experienceYears: existingUser?.experienceYears,
                workingHospitalContact: existingUser?.workingHospitalContact,
                documents: existingUser?.documents,
                _id: existingUser?._id,
                is_Blocked: existingUser?.is_Blocked,
                Wallet: existingUser?.Wallet,
                WalletHistory: existingUser?.WalletHistory,
                tokens,
                education: existingUser?.education,
              });
          } else {
            return res.status(403).json({ message: "User is blocked" });
          }
        } else {
          if (!userData.is_Blocked) {
            return res
              .status(201)
              .json({
                message: "GoolgeAuth",
                name: userData?.name,
                email: userData?.email,
                address: userData?.address,
                phone: userData?.phone,
                gender: userData?.gender,
                state: userData?.state,
                pincode: userData?.pincode,
                country: userData?.country,
                photo: userData?.photo,
                is_Verified: userData?.is_Verified,
                expertise: userData?.expertise,
                dateOfBirth: userData?.dateOfBirth,
                currentWorkingHospital: userData?.currentWorkingHospital,
                workingDays: userData?.workingDays,
                experienceYears: userData?.experienceYears,
                workingHospitalContact: userData?.workingHospitalContact,
                documents: userData?.documents,
                _id: userData?._id,
                is_Blocked: userData?.is_Blocked,
                Wallet: userData?.Wallet,
                WalletHistory: userData.WalletHistory,
                education: userData.education,
                tokens,
              });
          } else {
            res.status(403).json({ message: "User is blocked" });
          }
        }
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = {
          name,
          email,
          address,
          phone,
          gender,
          state,
          pincode,
          country,
          password: hashedPassword,
          photo,
          expertise,
          dateOfBirth,
          languageKnown,
          currentWorkingHospital,
        };
        const userData = await this._doctorService.signupDoctor(data);
        if (userData === null) {
          return res.status(400).json({ message: "User already exists" });
        }
        const otp = this._verificationService.generateOtp();
        await this._verificationService.SendOtpEmail(
          email,
          "Your OTP Code",
          otp
        );
        return res.status(201).json({
          message: "Doctor registered successfully and OTP sent",
          email,
          otp,
        });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async editDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        email,
        photo,
        currentWorkingHospital,
        dateOfBirth,
        experienceYears,
        gender,
        phone,
        workingHospitalContact,
        expertise,
        education,
      } = req.body;
      const data = await this._doctorService.editDoctor({
        name,
        email,
        photo,
        currentWorkingHospital,
        dateOfBirth,
        experienceYears,
        gender,
        phone,
        workingHospitalContact,
        expertise,
        education,
      });
      return res
        .status(200)
        .json({
          message: "Profile Updated",
          name: data?.name,
          email: data?.email,
          photo: data?.photo,
          currentWorkingHospital: data?.currentWorkingHospital,
          dateOfBirth: data?.dateOfBirth,
          experienceYears: data?.experienceYears,
          gender: data?.gender,
          phone: data?.phone,
          workingHospitalContact: data?.workingHospitalContact,
          expertise: data?.expertise,
          documents: data?.documents,
          _id: data?._id,
          Wallet: data?.Wallet,
          WalletHistory: data?.WalletHistory,
          education: data?.education,
        });
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async uploadDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, photo } = req.body;
      const data = await this._doctorService.uploadDocuments({ email, photo });
      if (data) {
        return res
          .status(200)
          .json({ message: "File uploaded", documents: data?.documents });
      } else {
        return res.status(400).json({ message: "Document failed to upload" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async deleteDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, index } = req.params;
      const data = await this._doctorService.deleteDocument(
        email,
        Number(index)
      );
      if (data) {
        return res
          .status(200)
          .json({ message: "Document Deleted", documents: data.documents });
      } else {
        return res.status(400).json({ message: "Deletion Of document falied" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async slotUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const slotsArray = req.body;

      const updateResults = await Promise.all(
        slotsArray.map(async (slotData: any) => {
          const { doctorId, date, startTime, endTime, duration, breakTime } =
            slotData;
          const slotsData = {
            doctorId,
            startDate: date,
            endDate: date,
            startTime,
            endTime,
            duration,
            breakTime,
          };
          try {
            const data = await this._doctorService.slotUpdate(
              slotsData as ISlotData
            );
            if (data) {
              return { success: true };
            } else {
              return { success: false, error: "Slots booking failed" };
            }
          } catch (error) {
            return { success: false };
          }
        })
      );

      const allSuccessful = updateResults.every((result) => result.success);

      if (allSuccessful) {
        return res.status(200).json({ message: "Slots updated successfully" });
      } else {
        const errors = updateResults
          .filter((result) => !result.success)
          .map((result) => result.error);
        return res
          .status(400)
          .json({ message: "Some slots failed to update", errors });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }

  async fetchSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, date } = req.query;
      const data = await this._doctorService.fetchSlots(
        id as string,
        date as string
      );
      if (data) {
        return res
          .status(200)
          .json({ message: "Slots are fetched", Slots: data });
      } else {
        return res
          .status(200)
          .json({ message: "Slots are fetched", Slots: [] });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async appointments(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, doctorId } = req.query;
      const data = await this._doctorService.appointments(
        doctorId as string,
        date as string
      );
      return res
        .status(200)
        .json({ messgage: "Appointments", appointments: data });
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async postPrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, prescriptions } = req.body;
      const data = await this._doctorService.postPrescription(
        id,
        prescriptions
      );
      return res.status(200).json({ message: "Prescription sended" });
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async fetchDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const { doctorId } = req.query;
      let id = doctorId;
      const data = await this._doctorService.fetchDoctor(id as string);
      if (data) {
        return res.status(200).json({ doctor: data });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async patientHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { doctorId, patientId } = req.query;
      const data = await this._doctorService.patientHistory(
        patientId as string,
        doctorId as string
      );
      return res.status(200).json({ patientHistory: data });
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async allAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const { doctorId } = req.query;
      const data = await this._doctorService.allAppointments(
        doctorId as string
      );
      return res
        .status(200)
        .json({ messgage: "Appointments", appointments: data });
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async updateBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;
      const data = await this._doctorService.updateBooking(id as string);
      if (data) {
        return res.status(200).json({ message: "Booking status updated" });
      } else {
        return res.status(500).json({ message: "Internal server Error" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
  async slotUpdateDay(req: Request, res: Response, next: NextFunction) {
    try {
      const { doctorId, date, slots } = req.body;
      const data = await this._doctorService.slotUpdateDay(
        doctorId,
        date,
        slots
      );
      return res.status(200).json({ message: "Slots are updated" });
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
}
