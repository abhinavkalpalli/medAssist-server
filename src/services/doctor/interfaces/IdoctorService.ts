import { IBooking } from "../../../models/bookingModel";
import { Doctor } from "../../../models/doctorModel";
import { ISlot, ISlotData } from "../../../models/slotModel";

export interface IdoctorService{
    signupDoctor(userData:Partial<Doctor>):Promise<Doctor | null>
    editDoctor(userData:Partial<Doctor>):Promise<Doctor | null>
    uploadDocuments(userData:Partial<Doctor>):Promise<Doctor|null>
    deleteDocument(email:string,index:number):Promise<Doctor|null>
    slotUpdate(slotData:ISlotData):Promise<boolean>
    slotUpdateDay(doctorId:string,date:string,slots:string[]):Promise<ISlot|null>
    fetchSlots(id:string,date:string):Promise<ISlot|null>
    appointments(doctorId:string,date:string):Promise<IBooking[]|null>
    postPrescription(id:string,prescriptions:string[]):Promise<IBooking|null>
    fetchDoctor(id:string):Promise<Doctor|null>
    patientHistory(patientId:string,doctorId:string):Promise<IBooking[]|null>
    allAppointments(doctorId:string):Promise<IBooking[]|null>
    updateBooking(id:string):Promise<IBooking|null>


}