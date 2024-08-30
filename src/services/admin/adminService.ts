import { Admin } from "../../models/adminModel";
import { IadminService } from "./interfaces/IadminService";
import adminRepository from "../../repositories/adminRepository";
import PatientRepository from "../../repositories/patientRepository";
import { Patient } from "../../models/patientModel";
import { Doctor } from "../../models/doctorModel";
import doctorRepository from "../../repositories/doctorRespository";
import { IBooking } from "../../models/bookingModel";
import { Expertise } from "../../models/expertise";

export default class adminService implements IadminService {
  private _adminRepository: adminRepository;
  private _patientsRepository: PatientRepository;
  private _doctorRepository: doctorRepository;
  constructor() {
    this._adminRepository = new adminRepository();
    this._patientsRepository = new PatientRepository();
    this._doctorRepository = new doctorRepository();
  }
  async signupAdmin(userData: Partial<Admin>): Promise<Admin | null> {
    try {
      return await this._adminRepository.signupAdmin(userData);
    } catch (err) {
      throw err;
    }
  }
  async patient(): Promise<Patient[] | null> {
    try {
      return await this._patientsRepository.patientFetch();
    } catch (err) {
      throw err;
    }
  }
  async doctors(): Promise<Doctor[] | null> {
    try {
      return await this._doctorRepository.doctorFetch();
    } catch (err) {
      throw err;
    }
  }
  async blockUnblockDoctors(
    id: string,
    status: boolean
  ): Promise<Doctor | null> {
    try {
      const data = await this._doctorRepository.fetchDoctor(id);
      if (data) {
        data.is_Blocked = !status;
        await data.save();
        return data;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
  async blockUnblockPatients(
    id: string,
    status: boolean
  ): Promise<Patient | null> {
    try {
      const data = await this._patientsRepository.fetchPatient(id);
      if (data) {
        data.is_Blocked = !status;
        await data.save();
        return data;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
  async documentsVerify(id: string): Promise<Doctor | null> {
    try {
      const data = await this._doctorRepository.fetchDoctor(id);
      if (data) {
        data.documents_verified = true;
        await data.save();
        return data;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
  async bookingList(
    page: string,
    date: string
  ): Promise<{
    bookings: IBooking[];
    totalBookings: number;
    totalPages: number;
  } | null> {
    try {
      return await this._adminRepository.bookingList(page, date);
    } catch (err) {
      throw err;
    }
  }
  async bookings(): Promise<IBooking[] | null> {
    try {
      return await this._adminRepository.bookings();
    } catch (err) {
      throw err;
    }
  }
  async updateFee(
    baseFee: number,
    Increment: number,
    email: string
  ): Promise<Admin | null> {
    try {
      const data = await this._adminRepository.findAdmin(email);
      if (data) {
        data.baseFee = baseFee;
        data.Increment = Increment;
        data.save();
        return data;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
  async addExpertise(name: string): Promise<Expertise | null> {
    try {
      return await this._adminRepository.addExpertise(name);
    } catch (error) {
      throw error;
    }
  }
  async expertise(): Promise<Expertise[] | null> {
    try {
      return await this._adminRepository.expertise();
    } catch (error) {
      throw error;
    }
  }
  async editExpertise(id: string, name: string): Promise<Expertise | null> {
    try {
      return await this._adminRepository.editExpertise(id, name);
    } catch (err) {
      throw err;
    }
  }
}
