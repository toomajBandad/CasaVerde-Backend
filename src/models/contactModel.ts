import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for Contact documents
export interface IContact extends Document {
  name: string;
  family: string;
  message: string;
  email: string;
}

// Define the schema
const ContactSchema: Schema<IContact> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    family: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the model
const Contact = mongoose.model<IContact>("Contact", ContactSchema);

// Export it properly
export default Contact;