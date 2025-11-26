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
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: Array,
    },
  },
  { timestamps: true }
);

// Create the model
const City = mongoose.model<CityDocument>("City", CitySchema);

// Export it properly
export default City;