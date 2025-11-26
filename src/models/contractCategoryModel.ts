import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for your documents
export interface IContractCategory extends Document {
  name: "BUY" | "RENT" | "SHARE";  // restrict to enum values
  desc: string;
}

// Define the schema
const contractCategorySchema: Schema<IContractCategory> = new Schema(
  {
    name: {
      type: String,
      enum: ["BUY", "RENT", "SHARE"],
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
const ContractCategory = mongoose.model<IContractCategory>(
  "ContractCategory",
  contractCategorySchema
);

// Export it properly
export default ContractCategory;