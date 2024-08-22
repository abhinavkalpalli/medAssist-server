import { Admin } from "../../models/adminModel"
import { IBooking } from "../../models/bookingModel"
import { Expertise } from "../../models/expertise";
export interface IadminRepository{
    signupAdmin(userData:Partial<Admin>):Promise<Admin|null>
    bookingList(page: string,date: string): Promise<{ bookings: IBooking[]; totalBookings: number; totalPages: number } | null>;
    bookings(): Promise< IBooking[]| null>;
    findAdmin(email:string):Promise<Admin|null>
    addExpertise(name:string):Promise<Expertise|null>
    expertise():Promise<Expertise[]|null>
    editExpertise(id:string,name:string):Promise<Expertise|null>
}