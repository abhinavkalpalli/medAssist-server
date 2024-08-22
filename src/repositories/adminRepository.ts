import Admins,{Admin} from '../models/adminModel'
import Booking, { IBooking } from '../models/bookingModel'
import expertise, { Expertise } from '../models/expertise'
import { IadminRepository } from './interfaces/IadminRepository'

export default class adminRepository implements IadminRepository{
    async signupAdmin(userData: Partial<Admin>): Promise<Admin | null> {
        try{
            const data=await Admins.findOne({email:userData.email})
            if(data){
                return null
            }
            return await Admins.create(userData)
        }catch(err){
            throw err
        }
    }
    async bookingList( page: string, date: string): Promise<{ bookings: IBooking[]; totalBookings: number; totalPages: number } | null> {
        try {
            const formatDate = (today:string) => {
                const date = new Date(today);
                const year = date.getUTCFullYear();
                const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                const day = String(date.getUTCDate()).padStart(2, '0');
                return `${year}-${month}-${day}T00:00:00.000+00:00`;
              };
              const formattedDate=formatDate(date)
            const bookings = await Booking.find({date:formattedDate}).populate({path:'doctorId'}).populate({path:'patientId'})
            const totalBookings=await Booking.find({date:formattedDate}).countDocuments()
            const totalPages=Math.ceil(totalBookings/10)
            return {bookings,totalBookings,totalPages}
        } catch (error) {
            throw error
        }
    }
    async bookings(): Promise<IBooking[] | null> {
        try{
            return await Booking.find().populate({path:'doctorId'}).populate({path:'patientId'})
        }catch(err){
            throw err
        }
    }
    async findAdmin(email: string): Promise<Admin | null> {
        try{
            return await Admins.findOne({email})
        }catch(err){
            throw err
        }
    }
    async addExpertise(name: string): Promise<Expertise | null> {
        try {
            const data=await expertise.findOne({name})
            if(data){
                return null
            }else{
                return await expertise.create({name:name})
            }
        } catch (error) {
            throw error
        }
    }
    async expertise(): Promise<Expertise[] | null> {
        try {
            const results = await expertise.find().exec();
            return results.length > 0 ? results : null;
        } catch (error) {
            throw error
        }
    }
    async editExpertise(id: string, name: string): Promise<Expertise | null> {
        try {
            const data=await expertise.findById(id)
            if(data){
                data.name=name
                data.save()
                return data
            }else{
                return null
            }
        } catch (error) {
            throw error
        }
    }
}