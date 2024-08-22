import { IBooking } from "../../models/bookingModel";
import { Doctor, DoctorQuery } from "../../models/doctorModel";
import { ISlot, ISlotData } from "../../models/slotModel";

export interface PaginatedDoctors {
    doctors: Doctor[];
    totalPages: number;
    currentPage: number;
}

export interface IdoctorRepository {
    signupDoctor(userData: Partial<Doctor>): Promise<Doctor | null>;
    doctorFetch(): Promise<Doctor[] | null>;
    fetchDoctor(id: string): Promise<Doctor | null>;
    singleDoctor(userData: Partial<Doctor>): Promise<Doctor | null>;
    slotUpdate(slotData:ISlotData): Promise<boolean>;
    slotUpdateDay(doctorId:string,date:string,slots:string[]):Promise<ISlot|null>
    fetchSlots(id: string, date: string): Promise<ISlot | null>;
    fetchDoctorsForPatient(query: DoctorQuery, page: number, limit: number): Promise<PaginatedDoctors | null>;
    appointments(doctorId:string,date:string):Promise<IBooking[]|null>
    fetchAppointment(id:string):Promise<IBooking|null>
    patientHistory(patientId:string,doctorId:string):Promise<IBooking[]|null>
    allAppointments(doctorId:string):Promise<IBooking[]|null>

}
