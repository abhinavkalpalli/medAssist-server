import { Schema, model, Document } from "mongoose";
import { updateAllDoctorFees } from "../middleware/feeUpdation";

export interface Admin extends Document {
    email: string;
    password: string;
    is_Verified: boolean;
    baseFee: number;
    Increment: number;
}

const adminSchema = new Schema<Admin>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_Verified: { type: Boolean, default: false },
    baseFee: { type: Number, default: 100 },
    Increment: { type: Number, default: 100 }
});
adminSchema.post('findOneAndUpdate', async function(doc) {
    await updateAllDoctorFees();
});
adminSchema.post('save', async function(doc) {
    await updateAllDoctorFees();
});
export default model<Admin>('Admins', adminSchema);
