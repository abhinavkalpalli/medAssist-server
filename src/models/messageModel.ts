import mongoose, { Document, Schema, Model, model } from 'mongoose';


export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  messageType: 'text' | 'voice' | 'image';
  message?: string;
}

const messageSchema: Schema<IMessage> = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "Doctors",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "Patients",
      required: true,
    },
    messageType: {
      type: String,
      enum: ['text', 'voice', 'image'],
      required: true,
    },
    message: {
      type: String,
      required: function (this: IMessage) {
        return this.messageType !== 'text';
      },
    },
  },
  { timestamps: true }
);

const Message: Model<IMessage> = model<IMessage>('Message', messageSchema);

export default Message;
