import { Schema, Document, model } from "mongoose";





export interface Appointment {
    id: string;
}

export interface Notification {
    id: string;
}
export interface WalletTransaction {
    date: Date;
    amount: number;
    message: string;
}


export interface Patient extends Document {
    name: string;
    email: string;
    phone: string;
    password:string
    gender: string;
    is_Verified:boolean;
    is_Blocked?: boolean;
    favourite_doctors?: { doctorId: string }[];
    appointments?: Appointment[];
    notifications?: Notification[];
    address?: string;
    pincode?:string;
    state?:string;
    country?:string; 
    photo?: string;
    Wallet?:number;
    WalletHistory:WalletTransaction[]
}



export default model<Patient>('Patients', new Schema<Patient>({
    name: { type: String, required: true },
    email: { type: String, required: true,unique:true },
    password:{type:String,default:''},
    phone: { type: String ,default:''},
    gender: { type: String,default:''},
    address: { type: String,default:''}, 
    state: { type: String,default:''},
    pincode: { type: String,default:'' },
    country: { type: String,default:''}, // Address is required
    is_Verified:{ type: Boolean, default: false },
    is_Blocked: { type: Boolean, default: false },
    favourite_doctors: [{doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'Doctors'
      }}],
    notifications: [{
        id: { type: String }
    }],
    photo: { type: String,default:'' },
    Wallet:{type: Number,default:0},
    WalletHistory: [{
        date: {
            type: Date,
            default: Date.now,
        },
        amount: {
            type: Number,
            default: 0,
        },
        message: {
            type: String,
            default: 'Initial entry',
        }
    }]
}, { timestamps: true }));