import { Patient } from "../../models/patientModel";
import { BookingAndSlots } from "../../models/bookingModel";
import { IBooking } from "../../models/bookingModel";
export interface IpatientRepository{
    signupPatient(userData:Partial<Patient>):Promise<Patient|null>
    patientFetch():Promise<Patient[]|null>
    fetchPatient(id:string):Promise<Patient|null>
    singlePatient(userData:Partial<Patient>):Promise<Patient|null>
    bookings(doctorId:string):Promise<BookingAndSlots|null>
    postbookings(userData:Partial<IBooking>):Promise<IBooking|null>
    yourBooking(patientId:string):Promise<IBooking[]|null>
    findAppointmentsAndCancel(id:string):Promise<IBooking|null>
}