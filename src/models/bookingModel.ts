import mongoose, { Document, Schema } from 'mongoose';
import { ISlot } from './slotModel';

export interface BookingAndSlots {
  List: IBooking[];
  Slot: ISlot[];
}




export interface IBooking extends Document {
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  date: Date;
  shift: string;
  status: string;
  payment:string
  Fee:number
  Prescription:string[]
}

const bookingSchema: Schema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctors',
    required: true
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patients',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  shift: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Active'
  },
  payment: {
    type:String,
    default:'Paid'
  },
  Fee:{
    type:Number
  },
  Prescription:{
    type:[String],
    default:[]
  }
}, { timestamps: true });

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
