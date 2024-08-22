import { Patient } from "../../models/patientModel";
import  { Doctor } from "../../models/doctorModel";
import { Admin } from "../../models/adminModel";


export interface IverificationRepository{
    otpverify(email:string):Promise<Patient|null>
    otpverifydoctor(email:string):Promise<Patient|null>
    otpverifyadmin(email:string):Promise<Admin|null>
    resetpassord(email:string):Promise<Patient|null>
    doctorresetpassord(email:string):Promise<Doctor|null>
    patientLogin(email:string):Promise<Patient|null>
    doctorLogin(email:string):Promise<Patient|null>
    adminLogin(email:string):Promise<Admin|null>
}