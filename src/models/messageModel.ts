import mongoose, { Schema, Document, Types } from "mongoose";

// Define the TypeScript interface for Message documents
export interface IMessage {
  senderId: Types.ObjectId;     // reference to User
  senderName: string;
  receiverId: Types.ObjectId;   // reference to User
  receiverName: string;
  roomId: Types.ObjectId;       // reference to Room
  message: string;
  time?: string;
  date?: string;
}

// Mongoose document type
export type MessageDocument = IMessage & Document;

// Define the schema
const MessageSchema: Schema<MessageDocument> = new Schema(
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
      ref: "Room", // corrected reference
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
const Message = mongoose.model<MessageDocument>("Message", MessageSchema);

// Export it properly
export default Message;