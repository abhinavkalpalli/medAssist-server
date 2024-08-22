import { Patient } from "../../../models/patientModel";
import { Doctor, DoctorQuery } from "../../../models/doctorModel";
import { PaginatedDoctors } from "../../../repositories/interfaces/IdoctorRepository";
import { BookingAndSlots, IBooking } from "../../../models/bookingModel";

export interface IpatientService{
    signupPatient(userData:Partial<Patient>):Promise<Patient | null>
    editPatient(userData:Partial<Patient>):Promise<Patient | null>
    doctors(query:DoctorQuery,page:number,limit:number):Promise<PaginatedDoctors | null>
    bookings(doctorId:string):Promise<BookingAndSlots|null>
    postbookings(userData:Partial<IBooking>):Promise<IBooking|null>
    yourBooking(patientId:string):Promise<IBooking[]|null>
    cancelAppointment(id:string):Promise<IBooking | null>
    fetchpatient(id:string):Promise<Patient|null>
    setFavourite(id:string,doctorId:string,status:boolean):Promise<Patient|null>
    postRating(doctorId:string,patientId:string,rating:number):Promise<Doctor|null>
}