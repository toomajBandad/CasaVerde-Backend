import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for TypeCategory documents
export interface ITypeCategory extends Document {
  name: "Apartment" | "Villa" | "Flat" | "Room" | "Office" | "Garage" | "Storage";
  desc: string;
}

// Define the schema
const typeCategorySchema: Schema<ITypeCategory> = new Schema(
  {
    name: {
      type: String,
      enum: ["Apartment", "Villa", "Flat", "Room", "Office", "Garage", "Storage"],
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the model
const TypeCategory = mongoose.model<ITypeCategory>("TypeCategory", typeCategorySchema);

// Export it properly
export default TypeCategory;