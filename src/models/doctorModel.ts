import mongoose, { Document, Schema } from 'mongoose';
import { WalletTransaction } from "./patientModel";
import Admin from "./adminModel";


export interface Doctor extends Document {
    email: string;
    name: string;
    address: string;
    password: string;
    state: string;
    country: string;
    pincode: string;
    expertise: mongoose.Types.ObjectId;
    experienceYears: number;
    workingHospitalContact: string;
    dateOfBirth: string;
    Fee: number;
    phone: string;
    gender: string;
    is_Verified: boolean;
    is_Blocked: boolean;
    documents_verified: boolean;
    documents?: string[];
    currentWorkingHospital: string;
    education:string,
    workingDays: string;
    photo?: string;
    Wallet?: number;
    WalletHistory: WalletTransaction[];
    review?: {
        patientId: mongoose.Types.ObjectId;
        rating: number;
    }[];
    rating?: number;
}

const doctorSchema = new Schema<Doctor>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, default: '' },
    password: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    pincode: { type: String, default: '' },
    expertise: { 
        type: Schema.Types.ObjectId,
        ref: 'Expertise',  
      },
    dateOfBirth: { type: String, default: '' },
    phone: { type: String, default: '' },
    gender: { type: String, default: '' },
    education: { type: String, default: '' },
    currentWorkingHospital: { type: String, default: '' },
    is_Verified: { type: Boolean, default: false },
    is_Blocked: { type: Boolean, default: false },
    documents_verified: { type: Boolean, default: false },
    workingHospitalContact: { type: String, default: '' },
    experienceYears: { type: Number, default: 0 },
    documents: [],
    Fee: { type: Number, default: 0 },
    workingDays: { type: String, default: '' },
    photo: { type: String, default: '' },
    Wallet: { type: Number, default: 0 },
    WalletHistory: [{
        date: { type: Date, default: Date.now },
        amount: { type: Number, default: 0 },
        message: { type: String, default: 'Initial entry' }
    }],
    review: [{
        patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patients' },
        rating: { type: Number, required: true }
    }],
    rating: { type: Number, default: 0 }
}, { timestamps: true });
doctorSchema.pre<Doctor>('save', async function(next) {
    const admin = await Admin.findOne();
    if (admin) {
        const { baseFee, Increment } = admin;
        let experienceMultiplier = 0;

        if (this.experienceYears >= 2 && this.experienceYears < 4) {
            experienceMultiplier = 1;
        } else if (this.experienceYears >= 4 && this.experienceYears < 6) {
            experienceMultiplier = 2;
        } else if (this.experienceYears >= 6 && this.experienceYears < 8) {
            experienceMultiplier = 3;
        } else if (this.experienceYears >= 8 && this.experienceYears < 10) {
            experienceMultiplier = 4;
        } else if (this.experienceYears >= 10) {
            experienceMultiplier = 5;
        }

        this.Fee = baseFee + (Increment * experienceMultiplier);
    }
    next();
});

export interface DoctorQuery {
    is_Verified: boolean;
    is_Blocked: boolean;
    documents_verified: boolean;
    experienceYears?: number;
    gender?: string;
    name?: { $regex: string, $options: string };
    expertise?: string |''
}


export default mongoose.model<Doctor>('Doctors', doctorSchema);
