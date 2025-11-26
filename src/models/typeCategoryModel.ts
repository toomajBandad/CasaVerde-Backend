import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for TypeCategory documents
export interface ITypeCategory {
  name: "Apartment" | "Villa" | "Flat" | "Room" | "Office" | "Garage" | "Storage"; // allowed category names
  desc: string; // category description
}

// Define the schema
const typeCategorySchema: Schema<ITypeCategory & Document> = new Schema(
  {
    name: {
      type: String,
      enum: ["Apartment", "Villa", "Flat", "Room", "Office", "Garage", "Storage"], // allowed values
      required: true,
      unique: true, // no duplicate categories
    },
    desc: {
      type: String,
      required: true, // must have a description
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// Create the model
const TypeCategory = mongoose.model<ITypeCategory & Document>(
  "TypeCategory",
  typeCategorySchema
);

// Export it properly
export default TypeCategory;