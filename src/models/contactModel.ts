import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for Contact documents
export interface IContact {
  name: string;
  family: string;
  message: string;
  email: string;
}

// Mongoose document type
export type ContactDocument = IContact & Document;

// Define the schema
const ContactSchema: Schema<ContactDocument> = new Schema(
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
const Contact = mongoose.model<ContactDocument>("Contact", ContactSchema);

// Export it properly
export default Contact;