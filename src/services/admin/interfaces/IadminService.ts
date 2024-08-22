import { Admin } from "../../../models/adminModel"
import { Patient } from "../../../models/patientModel"
import { Doctor } from "../../../models/doctorModel"
import { IBooking } from "../../../models/bookingModel"
import { Expertise } from "../../../models/expertise"

export interface IadminService{
    signupAdmin(userData:Partial<Admin>):Promise<Admin | null>
    patient():Promise<Patient[] | null>
    doctors():Promise<Doctor[] | null>
    blockUnblockDoctors(id:string,status:boolean):Promise<Doctor|null>
    blockUnblockPatients(id:string,status:boolean):Promise<Patient|null>
    documentsVerify(id:string):Promise<Doctor|null>
    bookingList(page: string,date: string): Promise<{ bookings: IBooking[]; totalBookings: number; totalPages: number } | null>;
    bookings(): Promise< IBooking[]| null>;
    updateFee(baseFee:number,Increment:number,email:string):Promise<Admin|null>
    addExpertise(name:string):Promise<Expertise|null>
    expertise():Promise<Expertise[]|null>
    editExpertise(id:string,name:string):Promise<Expertise|null>

}