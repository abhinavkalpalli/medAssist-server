import { Patient } from "../../models/patientModel";
import { IpatientService } from "./interfaces/IpatientService";
import PatientRepository from "../../repositories/patientRepository";
import mongoose from "mongoose";
import { Doctor, DoctorQuery } from "../../models/doctorModel";
import doctorRepository from "../../repositories/doctorRespository";
import { PaginatedDoctors } from "../../repositories/interfaces/IdoctorRepository";
import { BookingAndSlots, IBooking } from "../../models/bookingModel";

export default class patientService implements IpatientService {
  private _patientRepository: PatientRepository;
  private _doctorRepository: doctorRepository;
  constructor() {
    this._patientRepository = new PatientRepository();
    this._doctorRepository = new doctorRepository();
  }
  async signupPatient(userData: Partial<Patient>): Promise<Patient | null> {
    try {
      return await this._patientRepository.signupPatient(userData);
    } catch (error) {
      throw error;
    }
  }
  async editPatient(userData: Partial<Patient>): Promise<Patient | null> {
    try {
      const data = await this._patientRepository.singlePatient(userData);

      if (data) {
        data.name = userData.name ?? data.name;
        data.email = userData.email ?? data.email;
        data.photo = userData.photo ?? data.photo;
        await data.save();
        return data;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
  async doctors(
    query: DoctorQuery,
    page: number,
    limit: number
  ): Promise<PaginatedDoctors | null> {
    try {
      return await this._doctorRepository.fetchDoctorsForPatient(
        query,
        page,
        limit
      );
    } catch (err) {
      throw err;
    }
  }
  async bookings(doctorId: string): Promise<BookingAndSlots | null> {
    try {
      return await this._patientRepository.bookings(doctorId);
    } catch (err) {
      throw err;
    }
  }
  async postbookings(userData: Partial<IBooking>): Promise<IBooking | null> {
    try {
      return await this._patientRepository.postbookings(userData);
    } catch (err) {
      throw err;
    }
  }
  async yourBooking(patientId: string): Promise<IBooking[] | null> {
    try {
      return await this._patientRepository.yourBooking(patientId);
    } catch (err) {
      throw err;
    }
  }
  async cancelAppointment(id: string): Promise<IBooking | null> {
    try {
      const data = await this._patientRepository.findAppointmentsAndCancel(id);
      if (data) {
        data.status = "Cancelled";
        data.save();
        return data;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }
  async fetchpatient(id: string): Promise<Patient | null> {
    try {
      return await this._patientRepository.fetchPatient(id);
    } catch (err) {
      throw err;
    }
  }
  async setFavourite(
    id: string,
    doctorId: string,
    status: boolean
  ): Promise<Patient | null> {
    try {
      const data = await this._patientRepository.fetchPatient(id);
      if (!data) {
        throw new Error("Patient not found");
      }
      if (status) {
        if (data.favourite_doctors) {
          if (
            !data.favourite_doctors.some(
              (doc) => doc.doctorId.toString() === doctorId
            )
          ) {
            data.favourite_doctors.push({ doctorId });
          }
        } else {
          data.favourite_doctors = [{ doctorId }];
        }
      } else {
        if (data.favourite_doctors) {
          data.favourite_doctors = data.favourite_doctors.filter(
            (doc) => doc.doctorId.toString() !== doctorId
          );
        }
      }

      await data.save();

      return data;
    } catch (err) {
      throw err;
    }
  }
  async postRating(
    doctorId: string,
    patientId: string,
    rating: number
  ): Promise<Doctor | null> {
    try {
      const doctor = await this._doctorRepository.fetchDoctor(doctorId);
      if (doctor) {
        if (!doctor.review) {
          doctor.review = [];
        }

        const patientObjectId = new mongoose.Types.ObjectId(patientId);

        const existingReviewIndex = doctor.review.findIndex(
          (review) => review.patientId.toString() === patientObjectId.toString()
        );

        if (existingReviewIndex > -1) {
          doctor.review[existingReviewIndex].rating = rating;
        } else {
          const newRating = {
            patientId: patientObjectId,
            rating,
          };
          doctor.review.push(newRating);
        }
        const totalRating = doctor.review.reduce(
          (acc, item) => acc + item.rating,
          0
        );
        const averageRating = totalRating / doctor.review.length;
        doctor.rating = averageRating;
        await doctor.save();
        return doctor;
      } else {
        return null;
      }
    } catch (err) {
      console.error("Error posting rating:", err);
      throw err;
    }
  }
}
