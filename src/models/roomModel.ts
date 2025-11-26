import mongoose, { Schema, Document, Types } from "mongoose";

// Define the TypeScript interface for Room documents
export interface IRoom extends Document {
  users: Types.ObjectId[];   // array of User references
  property: Types.ObjectId;  // reference to Property
}

// Define the schema
const RoomSchema: Schema<IRoom> = new Schema(
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
const Room = mongoose.model<IRoom>("Room", RoomSchema);

// Export it properly
export default Room;