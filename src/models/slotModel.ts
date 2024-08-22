import { Schema, Document, model,Types } from 'mongoose';


export interface ISlot {
  doctorId: Types.ObjectId; // Use Types.ObjectId here
  date: Date;
  shifts: string[];
  createdAt?: Date;
  // Add other fields if needed
}
export interface ISlotData {
  doctorId: string;
  startDate: Date; 
  endDate: Date;  
  startTime: string;
  endTime: string;
  duration: number;
  breakTime: number;
}

const slotSchema = new Schema<ISlot>({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctors',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  shifts: [
    {
      type: String,
      required: true,
    },
  ],
});


const Slots = model<ISlot>('Slot', slotSchema);

export default Slots;
