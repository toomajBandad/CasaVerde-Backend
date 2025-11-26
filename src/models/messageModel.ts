import mongoose, { Schema, Document, Types } from "mongoose";

// Define the TypeScript interface for Message documents
export interface IMessage extends Document {
  senderId: Types.ObjectId;
  senderName: string;
  receiverId: Types.ObjectId;
  receiverName: string;
  roomId: Types.ObjectId;
  message: string;
  time?: string;
  date?: string;
}

// Define the schema
const MessageSchema: Schema<IMessage> = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "User", // if this should reference a Room model, change "User" to "Room"
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    time: {
      type: String,
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create the model
const Message = mongoose.model<IMessage>("Message", MessageSchema);

// Export it properly
export default Message;