import mongoose, { Document, Schema } from 'mongoose';

export interface Expertise extends Document{
    name:string
}
const expertiseSchema=new Schema<Expertise>({
    name:{type:String,required:true,unique:true}
})
export default mongoose.model<Expertise>('Expertise', expertiseSchema);
