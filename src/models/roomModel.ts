import mongoose, { Schema, Document, Types } from "mongoose";

// Define the TypeScript interface for Room documents
export interface IRoom {
  users: Types.ObjectId[];   // array of User references
  property: Types.ObjectId;  // reference to Property
}

// Mongoose document type
export type RoomDocument = IRoom & Document;

// Define the schema
const RoomSchema: Schema<RoomDocument> = new Schema(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
  },
  { timestamps: true }
);

// Create the model
const Room = mongoose.model<RoomDocument>("Room", RoomSchema);

// Export it properly
export default Room;