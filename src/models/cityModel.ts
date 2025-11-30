import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for City documents
export interface ICity {
  province: string;
  name: string;
  location?: string[]; // optional array of strings
}

// Mongoose document type
export type CityDocument = ICity & Document;

// Define the schema
const CitySchema: Schema<CityDocument> = new Schema(
  {
    province: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    location: {
      type: [String], 
      default: [],  
    },
  },
  { timestamps: true }
);

// Optional: compound index for province + name
CitySchema.index({ province: 1, name: 1 }, { unique: true });

// Create the model
const City = mongoose.model<CityDocument>("City", CitySchema);

// Export it properly
export default City;