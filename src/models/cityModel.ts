import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for City documents
export interface ICity extends Document {
  province: string;
  name: string;
  location?: string[]; 
}

// Define the schema
const CitySchema: Schema<ICity> = new Schema(
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
const City = mongoose.model<ICity>("City", CitySchema);

// Export it properly
export default City;